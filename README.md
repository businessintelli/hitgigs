# 🚀 HotGigs.ai - AI-Powered Job Portal Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991.svg)](https://openai.com/)

> **Revolutionary AI-powered job portal that transforms recruitment with intelligent matching, automated interviews, and comprehensive career guidance.**

## 🌟 Key Features

### 🤖 **AI-Powered Core Features**
- **Intelligent Job Matching**: AI-driven compatibility scoring between candidates and jobs
- **Resume Analysis**: Comprehensive skill extraction, domain expertise identification, and optimization suggestions
- **AI Interview Agent**: Conducts full interviews like a real person with personalized questions and assessments
- **Career Advisor**: Provides strategic career guidance and development recommendations
- **Job Description Generator**: Creates compelling, optimized job postings using AI

### 👥 **Multi-Role Platform**
- **Job Seekers**: Advanced profile management, AI-powered job recommendations, interview preparation
- **Companies**: Comprehensive hiring tools, team management, analytics dashboard
- **Freelance Recruiters**: Commission tracking, candidate sourcing, client management

### 🔐 **Enterprise Security**
- JWT-based authentication with refresh tokens
- OAuth integration (Google, LinkedIn, GitHub)
- Role-based access control (RBAC)
- Row-level security policies
- Comprehensive audit trails

### 📊 **Advanced Analytics**
- Real-time hiring metrics and insights
- Candidate pipeline analytics
- AI performance tracking
- Market intelligence and trends

## 🏗️ Architecture

### **Backend (Flask + Python)**
```
backend/
├── hotgigs-api/
│   ├── src/
│   │   ├── models/          # Database models and services
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic and AI services
│   │   └── utils/           # Utility functions
│   ├── migrations/          # Database migrations
│   └── requirements.txt     # Python dependencies
```

### **Frontend (React + TypeScript)**
```
frontend/
├── hotgigs-frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── contexts/        # React contexts for state management
│   │   └── hooks/           # Custom React hooks
│   ├── public/              # Static assets
│   └── package.json         # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL** (via Supabase)
- **OpenAI API Key**

### 1. Clone Repository
```bash
git clone https://github.com/businessintelli/hitgigs.git
cd hitgigs
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API keys to .env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Backend Setup
```bash
cd backend/hotgigs-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd src && python main.py
```

### 4. Frontend Setup
```bash
cd frontend/hotgigs-frontend
npm install
npm run dev
```

### 5. Database Setup
```bash
# Run database migrations
cd backend/hotgigs-api
python -m flask db upgrade
```

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/oauth` - OAuth authentication
- `POST /api/auth/refresh` - Token refresh

### **AI Features**
- `POST /api/ai/analyze-resume` - Resume analysis and scoring
- `POST /api/ai/job-matching/candidates` - Find matching jobs
- `POST /api/ai/job-matching/jobs` - Find matching candidates
- `POST /api/ai/interview/create` - Create AI interview session
- `POST /api/ai/career-advice` - Get career guidance

### **Job Management**
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Create new job posting
- `GET /api/jobs/{id}` - Get job details
- `POST /api/applications` - Submit job application

## 🤖 AI Capabilities

### **Resume Analysis Engine**
- **Skill Extraction**: Identifies technical and soft skills
- **Domain Expertise**: Recognizes industry knowledge (healthcare, finance, e-commerce, etc.)
- **Experience Analysis**: Evaluates career progression and achievements
- **Compatibility Scoring**: Calculates job-candidate fit percentage

### **AI Interview Agent**
- **Personalized Questions**: Generates questions based on job requirements and candidate background
- **Real-time Assessment**: Analyzes responses and asks follow-up questions
- **Comprehensive Scoring**: Evaluates technical skills, cultural fit, and communication
- **Detailed Reports**: Provides actionable insights for hiring decisions

### **Intelligent Matching**
- **Multi-factor Analysis**: Skills, experience, location, culture, salary expectations
- **Learning Algorithm**: Improves recommendations based on hiring feedback
- **Rejection Analysis**: Uses rejection patterns to enhance future matches

## 🛠️ Technology Stack

### **Backend**
- **Framework**: Flask (Python)
- **Database**: PostgreSQL with Supabase
- **AI/ML**: OpenAI GPT-4o-mini
- **Authentication**: JWT with OAuth providers
- **API Documentation**: Swagger/OpenAPI

### **Frontend**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite

### **Infrastructure**
- **Database**: Supabase (PostgreSQL)
- **AI Services**: OpenAI API
- **Authentication**: OAuth 2.0 (Google, LinkedIn, GitHub)
- **File Storage**: Supabase Storage
- **Deployment**: Docker-ready

## 📈 Development Roadmap

### ✅ **Completed (Phases 1-6)**
- [x] Project setup and environment configuration
- [x] Database schema design and Supabase integration
- [x] Backend API development with Flask
- [x] Authentication system with OAuth
- [x] Frontend React application
- [x] AI-powered core features implementation

### 🚧 **In Progress (Phases 7-14)**
- [ ] Multi-role user management and access control
- [ ] Job management and application tracking
- [ ] Document management and processing
- [ ] Advanced AI features integration
- [ ] Enterprise features and analytics
- [ ] Testing and quality assurance
- [ ] Production deployment
- [ ] Documentation and delivery

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o-mini API
- **Supabase** for the backend infrastructure
- **React Team** for the amazing frontend framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

For support, email support@hotgigs.ai or join our [Discord community](https://discord.gg/hotgigs).

---

<div align="center">
  <strong>Built with ❤️ by the HotGigs.ai Team</strong>
  <br>
  <a href="https://hotgigs.ai">Website</a> •
  <a href="https://docs.hotgigs.ai">Documentation</a> •
  <a href="https://github.com/businessintelli/hitgigs/issues">Issues</a> •
  <a href="https://github.com/businessintelli/hitgigs/discussions">Discussions</a>
</div>

