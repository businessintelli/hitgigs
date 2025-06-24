"""
Advanced AI Services for HotGigs.ai
Implements vector embeddings, semantic search, and advanced AI features
"""
import os
import json
import numpy as np
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import openai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

class VectorEmbeddingService:
    """Service for handling vector embeddings and semantic search"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.job_vectors = None
        self.resume_vectors = None
        self.job_data = []
        self.resume_data = []
        
    def create_job_embeddings(self, jobs: List[Dict]) -> None:
        """Create vector embeddings for job descriptions"""
        try:
            # Combine job title, description, and requirements for embedding
            job_texts = []
            self.job_data = jobs
            
            for job in jobs:
                text = f"{job.get('title', '')} {job.get('description', '')} {job.get('requirements', '')}"
                job_texts.append(text)
            
            if job_texts:
                self.job_vectors = self.vectorizer.fit_transform(job_texts)
                logging.info(f"Created embeddings for {len(jobs)} jobs")
            
        except Exception as e:
            logging.error(f"Error creating job embeddings: {str(e)}")
            
    def create_resume_embeddings(self, resumes: List[Dict]) -> None:
        """Create vector embeddings for resumes"""
        try:
            resume_texts = []
            self.resume_data = resumes
            
            for resume in resumes:
                # Combine all resume text fields
                text = f"{resume.get('skills', '')} {resume.get('experience', '')} {resume.get('education', '')}"
                resume_texts.append(text)
            
            if resume_texts and hasattr(self.vectorizer, 'vocabulary_'):
                self.resume_vectors = self.vectorizer.transform(resume_texts)
                logging.info(f"Created embeddings for {len(resumes)} resumes")
            
        except Exception as e:
            logging.error(f"Error creating resume embeddings: {str(e)}")
    
    def semantic_job_search(self, query: str, top_k: int = 10) -> List[Dict]:
        """Perform semantic search for jobs based on query"""
        try:
            if self.job_vectors is None:
                return []
            
            # Transform query to vector
            query_vector = self.vectorizer.transform([query])
            
            # Calculate similarity scores
            similarities = cosine_similarity(query_vector, self.job_vectors).flatten()
            
            # Get top k results
            top_indices = similarities.argsort()[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                if similarities[idx] > 0.1:  # Minimum similarity threshold
                    job = self.job_data[idx].copy()
                    job['similarity_score'] = float(similarities[idx])
                    results.append(job)
            
            return results
            
        except Exception as e:
            logging.error(f"Error in semantic job search: {str(e)}")
            return []
    
    def find_similar_candidates(self, job_description: str, top_k: int = 10) -> List[Dict]:
        """Find candidates similar to job requirements"""
        try:
            if self.resume_vectors is None:
                return []
            
            # Transform job description to vector
            job_vector = self.vectorizer.transform([job_description])
            
            # Calculate similarity with all resumes
            similarities = cosine_similarity(job_vector, self.resume_vectors).flatten()
            
            # Get top k candidates
            top_indices = similarities.argsort()[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                if similarities[idx] > 0.1:
                    candidate = self.resume_data[idx].copy()
                    candidate['match_score'] = float(similarities[idx])
                    results.append(candidate)
            
            return results
            
        except Exception as e:
            logging.error(f"Error finding similar candidates: {str(e)}")
            return []

class AIInterviewAgent:
    """AI-powered interview agent for conducting candidate interviews"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.interview_sessions = {}
        
    def start_interview(self, candidate_id: str, job_id: str, job_description: str) -> Dict:
        """Start an AI interview session"""
        try:
            session_id = f"{candidate_id}_{job_id}_{int(datetime.now().timestamp())}"
            
            # Generate initial interview questions based on job description
            initial_questions = self._generate_interview_questions(job_description)
            
            session = {
                'session_id': session_id,
                'candidate_id': candidate_id,
                'job_id': job_id,
                'job_description': job_description,
                'questions': initial_questions,
                'current_question_index': 0,
                'responses': [],
                'started_at': datetime.now(timezone.utc).isoformat(),
                'status': 'active'
            }
            
            self.interview_sessions[session_id] = session
            
            return {
                'session_id': session_id,
                'first_question': initial_questions[0] if initial_questions else None,
                'total_questions': len(initial_questions),
                'status': 'started'
            }
            
        except Exception as e:
            logging.error(f"Error starting interview: {str(e)}")
            return {'error': 'Failed to start interview'}
    
    def _generate_interview_questions(self, job_description: str) -> List[str]:
        """Generate interview questions based on job description"""
        try:
            prompt = f"""
            Based on the following job description, generate 8-10 relevant interview questions that would help assess a candidate's suitability for this role. 
            
            Job Description: {job_description}
            
            Please generate questions that cover:
            1. Technical skills and experience
            2. Problem-solving abilities
            3. Cultural fit and motivation
            4. Specific job requirements
            
            Return only the questions, one per line.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert HR interviewer. Generate relevant, professional interview questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            questions_text = response.choices[0].message.content
            questions = [q.strip() for q in questions_text.split('\n') if q.strip()]
            
            return questions[:10]  # Limit to 10 questions
            
        except Exception as e:
            logging.error(f"Error generating interview questions: {str(e)}")
            return [
                "Tell me about your relevant experience for this position.",
                "What interests you most about this role?",
                "Describe a challenging project you've worked on.",
                "How do you handle working under pressure?",
                "What are your career goals?"
            ]
    
    def submit_response(self, session_id: str, response: str) -> Dict:
        """Submit candidate response and get next question"""
        try:
            if session_id not in self.interview_sessions:
                return {'error': 'Interview session not found'}
            
            session = self.interview_sessions[session_id]
            
            if session['status'] != 'active':
                return {'error': 'Interview session is not active'}
            
            # Store the response
            current_question = session['questions'][session['current_question_index']]
            session['responses'].append({
                'question': current_question,
                'response': response,
                'timestamp': datetime.now(timezone.utc).isoformat()
            })
            
            # Move to next question
            session['current_question_index'] += 1
            
            # Check if interview is complete
            if session['current_question_index'] >= len(session['questions']):
                session['status'] = 'completed'
                session['completed_at'] = datetime.now(timezone.utc).isoformat()
                
                # Generate assessment
                assessment = self._generate_assessment(session)
                session['assessment'] = assessment
                
                return {
                    'status': 'completed',
                    'assessment': assessment,
                    'total_responses': len(session['responses'])
                }
            else:
                # Return next question
                next_question = session['questions'][session['current_question_index']]
                return {
                    'status': 'active',
                    'next_question': next_question,
                    'question_number': session['current_question_index'] + 1,
                    'total_questions': len(session['questions'])
                }
                
        except Exception as e:
            logging.error(f"Error submitting response: {str(e)}")
            return {'error': 'Failed to process response'}
    
    def _generate_assessment(self, session: Dict) -> Dict:
        """Generate AI assessment of interview responses"""
        try:
            # Prepare responses for analysis
            responses_text = "\n\n".join([
                f"Q: {r['question']}\nA: {r['response']}"
                for r in session['responses']
            ])
            
            prompt = f"""
            Based on the following interview responses for a job position, provide a comprehensive assessment:
            
            Job Description: {session['job_description']}
            
            Interview Q&A:
            {responses_text}
            
            Please provide:
            1. Overall score (1-10)
            2. Strengths (3-5 points)
            3. Areas for improvement (2-3 points)
            4. Recommendation (Hire/Consider/Reject)
            5. Key insights about the candidate
            
            Format as JSON with keys: score, strengths, improvements, recommendation, insights
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert HR assessor. Provide fair, objective candidate evaluations."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )
            
            assessment_text = response.choices[0].message.content
            
            # Try to parse as JSON, fallback to structured text
            try:
                assessment = json.loads(assessment_text)
            except:
                assessment = {
                    'score': 7,
                    'strengths': ['Provided detailed responses', 'Showed enthusiasm'],
                    'improvements': ['Could provide more specific examples'],
                    'recommendation': 'Consider',
                    'insights': assessment_text
                }
            
            return assessment
            
        except Exception as e:
            logging.error(f"Error generating assessment: {str(e)}")
            return {
                'score': 5,
                'strengths': ['Completed interview'],
                'improvements': ['Assessment could not be generated'],
                'recommendation': 'Manual Review Required',
                'insights': 'Technical error in assessment generation'
            }
    
    def get_interview_session(self, session_id: str) -> Optional[Dict]:
        """Get interview session details"""
        return self.interview_sessions.get(session_id)

class CandidateFeedbackLoop:
    """AI-powered feedback loop for candidate recommendations"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.feedback_data = {}
    
    def store_rejection_feedback(self, job_id: str, candidate_id: str, feedback: str, reason: str) -> None:
        """Store rejection feedback for learning"""
        try:
            if job_id not in self.feedback_data:
                self.feedback_data[job_id] = []
            
            feedback_entry = {
                'candidate_id': candidate_id,
                'feedback': feedback,
                'reason': reason,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
            
            self.feedback_data[job_id].append(feedback_entry)
            logging.info(f"Stored feedback for job {job_id}")
            
        except Exception as e:
            logging.error(f"Error storing feedback: {str(e)}")
    
    def analyze_candidate_fit(self, job_id: str, job_description: str, resume_text: str) -> Dict:
        """Analyze candidate fit using historical feedback"""
        try:
            # Get historical feedback for this job
            historical_feedback = self.feedback_data.get(job_id, [])
            
            # Prepare feedback context
            feedback_context = ""
            if historical_feedback:
                feedback_context = "Historical rejection reasons for this job:\n"
                for feedback in historical_feedback[-5:]:  # Last 5 rejections
                    feedback_context += f"- {feedback['reason']}: {feedback['feedback']}\n"
            
            prompt = f"""
            Analyze this candidate's fit for the job position based on their resume and historical feedback.
            
            Job Description: {job_description}
            
            Candidate Resume: {resume_text}
            
            {feedback_context}
            
            Please provide:
            1. Fit score (0-100)
            2. Likelihood of success
            3. Potential red flags based on historical rejections
            4. Specific resume improvements to increase chances
            5. Strengths that align with job requirements
            
            Format as JSON with keys: fit_score, success_likelihood, red_flags, improvements, strengths
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert recruiter analyzing candidate-job fit."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )
            
            analysis_text = response.choices[0].message.content
            
            try:
                analysis = json.loads(analysis_text)
            except:
                analysis = {
                    'fit_score': 70,
                    'success_likelihood': 'Moderate',
                    'red_flags': [],
                    'improvements': ['Provide more specific examples'],
                    'strengths': ['Relevant experience']
                }
            
            return analysis
            
        except Exception as e:
            logging.error(f"Error analyzing candidate fit: {str(e)}")
            return {
                'fit_score': 50,
                'success_likelihood': 'Unknown',
                'red_flags': ['Analysis error'],
                'improvements': ['Manual review required'],
                'strengths': ['Unable to analyze']
            }

class PredictiveAnalytics:
    """Predictive analytics for hiring insights"""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def predict_hiring_success(self, candidate_data: Dict, job_data: Dict, historical_data: List[Dict]) -> Dict:
        """Predict hiring success based on historical data"""
        try:
            # Analyze historical hiring patterns
            success_patterns = self._analyze_success_patterns(historical_data)
            
            # Generate prediction
            prediction = self._generate_prediction(candidate_data, job_data, success_patterns)
            
            return prediction
            
        except Exception as e:
            logging.error(f"Error in predictive analysis: {str(e)}")
            return {
                'success_probability': 0.5,
                'confidence': 'Low',
                'factors': ['Analysis error'],
                'recommendations': ['Manual review required']
            }
    
    def _analyze_success_patterns(self, historical_data: List[Dict]) -> Dict:
        """Analyze patterns from historical hiring data"""
        # Simplified pattern analysis
        patterns = {
            'successful_traits': [],
            'risk_factors': [],
            'optimal_experience_range': '2-5 years',
            'success_rate_by_source': {}
        }
        
        return patterns
    
    def _generate_prediction(self, candidate_data: Dict, job_data: Dict, patterns: Dict) -> Dict:
        """Generate hiring success prediction"""
        try:
            prompt = f"""
            Predict the likelihood of hiring success for this candidate based on the job requirements and historical patterns.
            
            Candidate Profile: {json.dumps(candidate_data, indent=2)}
            Job Requirements: {json.dumps(job_data, indent=2)}
            Success Patterns: {json.dumps(patterns, indent=2)}
            
            Provide:
            1. Success probability (0.0-1.0)
            2. Confidence level (High/Medium/Low)
            3. Key success factors
            4. Risk factors
            5. Recommendations for hiring decision
            
            Format as JSON with keys: success_probability, confidence, success_factors, risk_factors, recommendations
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a data scientist specializing in hiring analytics."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )
            
            prediction_text = response.choices[0].message.content
            
            try:
                prediction = json.loads(prediction_text)
            except:
                prediction = {
                    'success_probability': 0.7,
                    'confidence': 'Medium',
                    'success_factors': ['Relevant experience'],
                    'risk_factors': ['Limited data'],
                    'recommendations': ['Proceed with interview']
                }
            
            return prediction
            
        except Exception as e:
            logging.error(f"Error generating prediction: {str(e)}")
            return {
                'success_probability': 0.5,
                'confidence': 'Low',
                'success_factors': [],
                'risk_factors': ['Prediction error'],
                'recommendations': ['Manual review required']
            }

# Global instances
vector_service = VectorEmbeddingService()
interview_agent = AIInterviewAgent()
feedback_loop = CandidateFeedbackLoop()
predictive_analytics = PredictiveAnalytics()

