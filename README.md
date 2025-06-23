# HotGigs.ai - Enterprise Job Portal Platform

## Overview

HotGigs.ai is a comprehensive enterprise-grade job portal with 17 advanced features including AI-powered matching, multi-role access control, document management, and complete talent lifecycle management.

## Features

### 🤖 AI-Powered Core Features (10 Features)
1. **Generative AI Job Matching Engine** - Semantic search with vector embeddings and ML-powered candidate scoring
2. **Generative AI Interface (ChatGPT-like)** - Natural language querying for all platform data
3. **Intelligent Resume Analysis and Optimization** - 10-dimension scoring system with detailed feedback
4. **Advanced AI Interview Agent** - Role-specific questioning with dynamic adaptation
5. **AI-Powered Document Intelligence** - OCR with fraud detection and authenticity verification
6. **AI Job Description Generator** - Automated generation with industry-specific optimization
7. **AI Career Path Advisor** - Personalized career development recommendations
8. **AI Rejection Feedback Learning System** - Pattern recognition from rejection data
9. **Predictive Analytics and Market Intelligence** - ML-powered hiring outcome prediction
10. **Intelligent Workflow Automation** - AI-driven process automation and optimization

### 📊 Data Management & Export Features (3 Features)
1. **Comprehensive Application Tracking Dashboard** - Real-time pipeline visualization with analytics
2. **Candidate Tracking & Export System** - Professional Excel and PDF report generation
3. **Bulk Resume Upload & Management System** - Multi-source import with AI-powered parsing

### 👥 User Experience & Interface Features (2 Features)
1. **Enhanced Task Management & Assignment System** - Comprehensive workflow management
2. **Enhanced Resume Viewing System** - AI-generated visual resume summaries

### 🔐 Privacy & Security Features (2 Features)
1. **Social Authentication System** - Complete OAuth integration (Google, LinkedIn, GitHub)
2. **Client Contact Privacy & Job Visibility Controls** - Granular privacy controls

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Redux Toolkit** for state management
- **Tailwind CSS** for responsive design
- **Socket.io** for real-time features
- **React Router** with role-based protection

### Backend
- **Flask** with Python 3.11
- **Supabase PostgreSQL** with 25+ tables
- **Celery with Redis** for background jobs
- **OpenAI GPT-4o-mini** for AI features
- **JWT authentication** with role-based access

### Infrastructure
- **Manus Platform** deployment
- **Cloud Storage Integration**
- **Email Services** with branded templates
- **Document Processing** with OCR

## User Roles

### 1. Candidates
- Job search and application tracking
- AI-powered profile optimization
- Interview preparation tools
- Career path recommendations

### 2. Companies
- Role-based team management (Admin, Recruiter, Account Manager)
- Candidate database access
- Job posting and applicant tracking
- Onboarding workflows and contract management

### 3. Freelance Recruiters
- Access to job postings
- Candidate referral system
- Commission tracking
- Performance analytics

## Project Structure

```
hotgigs-ai/
├── backend/                 # Flask API server
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   ├── tests/             # Backend tests
│   └── requirements.txt   # Python dependencies
├── frontend/              # React application
│   └── hotgigs-frontend/
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── store/     # Redux store
│       │   ├── services/  # API services
│       │   └── types/     # TypeScript types
│       └── package.json   # Node dependencies
├── docs/                  # Documentation
├── scripts/              # Deployment scripts
├── config/               # Configuration files
└── .env                  # Environment variables
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL (via Supabase)
- Redis (for background jobs)

### Environment Setup
1. Copy `.env.example` to `.env` and configure variables
2. Set up Supabase project and database
3. Configure OAuth applications (Google, LinkedIn, GitHub)
4. Obtain OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
flask run
```

### Frontend Setup
```bash
cd frontend/hotgigs-frontend
pnpm install
pnpm run dev
```

## API Documentation

The API follows RESTful conventions with the following main endpoints:

- `/api/auth/*` - Authentication and user management
- `/api/jobs/*` - Job posting and management
- `/api/applications/*` - Application tracking
- `/api/candidates/*` - Candidate management
- `/api/ai/*` - AI-powered features
- `/api/documents/*` - Document processing

## Development Guidelines

### Code Style
- Backend: Follow PEP 8 for Python code
- Frontend: Use ESLint and Prettier for TypeScript/React
- Use meaningful variable and function names
- Write comprehensive tests for all features

### Git Workflow
- Use feature branches for development
- Write descriptive commit messages
- Create pull requests for code review
- Maintain clean commit history

## Testing

### Backend Testing
```bash
cd backend
pytest tests/
```

### Frontend Testing
```bash
cd frontend/hotgigs-frontend
pnpm test
```

## Deployment

The application is designed for deployment on the Manus Platform with automatic CI/CD.

### Production Deployment
1. Configure production environment variables
2. Set up production database
3. Deploy backend API
4. Deploy frontend application
5. Configure domain and SSL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions, please contact the development team.

---

**HotGigs.ai** - Revolutionizing talent acquisition with AI-powered solutions.

