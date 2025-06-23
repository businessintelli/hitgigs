# HotGigs.ai API Documentation

## Overview
HotGigs.ai is a comprehensive enterprise-grade job portal with AI-powered features, multi-role access, and complete talent lifecycle management.

**Base URL:** `http://localhost:5000/api`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API health status

### Authentication Endpoints (`/auth`)
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login with email/password
- **POST** `/auth/oauth` - OAuth login (Google, GitHub, LinkedIn)
- **POST** `/auth/refresh` - Refresh access token
- **GET** `/auth/me` - Get current user profile
- **POST** `/auth/logout` - Logout user
- **POST** `/auth/forgot-password` - Request password reset
- **POST** `/auth/change-password` - Change user password

### User Management (`/users`)
- **GET** `/users/profile` - Get current user's complete profile
- **PUT** `/users/profile` - Update user profile
- **PUT** `/users/candidate-profile` - Update candidate-specific profile
- **POST** `/users/experience` - Add work experience
- **POST** `/users/education` - Add education
- **GET** `/users/search` - Search users
- **GET** `/users/<user_id>` - Get user profile by ID

### Company Management (`/companies`)
- **POST** `/companies/` - Create a new company
- **GET** `/companies/` - Get companies for current user
- **GET** `/companies/<company_id>` - Get company details
- **GET** `/companies/<company_id>/members` - Get company team members

### Job Management (`/jobs`)
- **GET** `/jobs/` - Get public job listings (no auth required)
- **GET** `/jobs/<job_id>` - Get job details (no auth required)
- **POST** `/jobs/` - Create a new job posting

### Application Tracking (`/applications`)
- **POST** `/applications/` - Apply to a job
- **GET** `/applications/` - Get applications for current user

### Candidate Search (`/candidates`)
- **GET** `/candidates/search` - Search candidates (for companies/recruiters)

### AI Features (`/ai`) - Placeholder
- **GET** `/ai/job-matches` - Get AI-powered job matches
- **POST** `/ai/resume-analysis` - Analyze resume with AI

### Document Management (`/documents`) - Placeholder
- **POST** `/documents/upload` - Upload document

### Analytics (`/analytics`) - Placeholder
- **GET** `/analytics/dashboard` - Get dashboard analytics data

### Notifications (`/notifications`)
- **GET** `/notifications/` - Get user notifications
- **PUT** `/notifications/<notification_id>/read` - Mark notification as read

## User Types
- **candidate** - Job seekers
- **company** - Employers
- **freelance_recruiter** - Independent recruiters

## OAuth Providers Supported
- Google
- GitHub
- LinkedIn

## Request/Response Format
All requests and responses use JSON format.

### Example Registration Request
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "candidate"
}
```

### Example Response
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "candidate"
  },
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here"
}
```

## Error Handling
The API returns appropriate HTTP status codes and error messages:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error

### Example Error Response
```json
{
  "error": "Validation error",
  "details": {
    "email": ["Not a valid email address."]
  }
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation with Marshmallow
- Role-based access control
- OAuth integration

## Database Integration
- Supabase PostgreSQL database
- Row-level security policies
- Multi-tenant architecture
- Comprehensive audit trails

## Next Steps
1. Set up Supabase database with provided schema
2. Configure environment variables
3. Deploy frontend React application
4. Implement AI features
5. Add enterprise analytics dashboard

