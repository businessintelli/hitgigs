# HotGigs.ai OAuth Configuration Guide

## 🔐 **Social Authentication Setup for www.hotgigs.ai**

This document provides the complete OAuth configuration for HotGigs.ai social authentication providers.

---

## 📋 **OAuth Redirect URLs Summary**

### **Production Domain**: `www.hotgigs.ai`

| Provider | Redirect URL |
|----------|--------------|
| **Google** | `https://www.hotgigs.ai/auth/google/callback` |
| **LinkedIn** | `https://www.hotgigs.ai/auth/linkedin/callback` |
| **GitHub** | `https://www.hotgigs.ai/auth/github/callback` |
| **Microsoft** | `https://www.hotgigs.ai/auth/microsoft/callback` |

---

## 🔧 **Provider-Specific Configuration**

### **1. Google OAuth Setup**

#### **Google Cloud Console Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Create **OAuth 2.0 Client ID**

#### **Configuration Details**
```
Application Type: Web Application
Name: HotGigs.ai Production
Authorized JavaScript Origins:
  - https://www.hotgigs.ai
  - https://hotgigs.ai
Authorized Redirect URIs:
  - https://www.hotgigs.ai/auth/google/callback
```

#### **Required Scopes**
```
- openid
- email
- profile
- https://www.googleapis.com/auth/userinfo.email
- https://www.googleapis.com/auth/userinfo.profile
```

#### **Environment Variables**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://www.hotgigs.ai/auth/google/callback
```

---

### **2. LinkedIn OAuth Setup**

#### **LinkedIn Developer Portal Configuration**
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app or select existing
3. Navigate to **Auth** tab

#### **Configuration Details**
```
App Name: HotGigs.ai
Company: HotGigs.ai
Privacy Policy URL: https://www.hotgigs.ai/privacy-policy
Terms of Use URL: https://www.hotgigs.ai/terms-of-service
Application Logo: [Upload HotGigs.ai logo]

Authorized Redirect URLs:
  - https://www.hotgigs.ai/auth/linkedin/callback
```

#### **Required Scopes**
```
- r_liteprofile
- r_emailaddress
- w_member_social (if posting features needed)
```

#### **Environment Variables**
```bash
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://www.hotgigs.ai/auth/linkedin/callback
```

---

### **3. GitHub OAuth Setup**

#### **GitHub Developer Settings Configuration**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in application details

#### **Configuration Details**
```
Application Name: HotGigs.ai
Homepage URL: https://www.hotgigs.ai
Application Description: AI-Powered Job Portal for Candidates, Companies, and Recruiters
Authorization Callback URL: https://www.hotgigs.ai/auth/github/callback
```

#### **Required Scopes**
```
- user:email
- read:user
```

#### **Environment Variables**
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://www.hotgigs.ai/auth/github/callback
```

---

### **4. Microsoft OAuth Setup (Optional)**

#### **Azure App Registration Configuration**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**

#### **Configuration Details**
```
Name: HotGigs.ai
Supported Account Types: Accounts in any organizational directory and personal Microsoft accounts
Redirect URI (Web): https://www.hotgigs.ai/auth/microsoft/callback
```

#### **Required Scopes**
```
- openid
- email
- profile
- User.Read
```

#### **Environment Variables**
```bash
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_REDIRECT_URI=https://www.hotgigs.ai/auth/microsoft/callback
```

---

## 🌐 **Domain Configuration**

### **Primary Domain**
- **Production**: `https://www.hotgigs.ai`
- **API Endpoint**: `https://api.hotgigs.ai`

### **Allowed Origins for CORS**
```
- https://www.hotgigs.ai
- https://hotgigs.ai
- https://api.hotgigs.ai
```

### **SSL Certificate Requirements**
- Valid SSL certificate for `www.hotgigs.ai`
- Valid SSL certificate for `api.hotgigs.ai`
- Redirect HTTP to HTTPS

---

## 🔒 **Security Configuration**

### **OAuth Security Best Practices**
```bash
# Use secure session cookies
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTPONLY=true
SESSION_COOKIE_SAMESITE=Lax

# CSRF Protection
CSRF_PROTECTION=true

# Rate Limiting
RATE_LIMIT_OAUTH=10_per_minute

# Token Expiration
JWT_ACCESS_TOKEN_EXPIRES=24_hours
JWT_REFRESH_TOKEN_EXPIRES=30_days
```

### **Required Security Headers**
```
Content-Security-Policy: default-src 'self' https://www.hotgigs.ai https://api.hotgigs.ai
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📱 **Mobile App Configuration (Future)**

### **Deep Link URLs**
```
iOS: hotgigs://auth/callback
Android: hotgigs://auth/callback
```

### **Mobile Redirect URLs**
```
Google: https://www.hotgigs.ai/auth/google/mobile-callback
LinkedIn: https://www.hotgigs.ai/auth/linkedin/mobile-callback
GitHub: https://www.hotgigs.ai/auth/github/mobile-callback
```

---

## 🧪 **Testing Configuration**

### **Development/Staging URLs**
```
Development: https://dev.hotgigs.ai/auth/{provider}/callback
Staging: https://staging.hotgigs.ai/auth/{provider}/callback
```

### **Test Accounts**
- Create test accounts for each OAuth provider
- Verify OAuth flow in development environment
- Test error handling and edge cases

---

## 📋 **Implementation Checklist**

### **Backend Implementation**
- [ ] Install OAuth libraries (Flask-OAuthlib, Authlib)
- [ ] Configure OAuth routes for each provider
- [ ] Implement user creation/linking logic
- [ ] Add proper error handling
- [ ] Set up session management
- [ ] Configure CORS for OAuth endpoints

### **Frontend Implementation**
- [ ] Add OAuth buttons to login/register pages
- [ ] Implement OAuth redirect handling
- [ ] Add loading states for OAuth flows
- [ ] Handle OAuth errors gracefully
- [ ] Store OAuth tokens securely
- [ ] Implement logout functionality

### **Provider Setup**
- [ ] Configure Google OAuth application
- [ ] Configure LinkedIn OAuth application
- [ ] Configure GitHub OAuth application
- [ ] Configure Microsoft OAuth application (optional)
- [ ] Verify all redirect URLs
- [ ] Test OAuth flows

### **Security & Compliance**
- [ ] Implement CSRF protection
- [ ] Add rate limiting for OAuth endpoints
- [ ] Configure secure session cookies
- [ ] Set up proper CORS headers
- [ ] Implement token refresh logic
- [ ] Add audit logging for OAuth events

---

## 🚀 **Deployment Notes**

### **DNS Configuration**
```
www.hotgigs.ai → Frontend Application
api.hotgigs.ai → Backend API
```

### **SSL/TLS Requirements**
- Wildcard certificate for *.hotgigs.ai
- Or separate certificates for www.hotgigs.ai and api.hotgigs.ai

### **Environment Variables Deployment**
- Use secure environment variable management
- Never commit secrets to version control
- Use different credentials for development/staging/production
- Rotate OAuth secrets regularly

---

## 📞 **Support Information**

### **OAuth Provider Support**
- **Google**: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- **LinkedIn**: [LinkedIn OAuth Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- **GitHub**: [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- **Microsoft**: [Microsoft OAuth Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)

### **HotGigs.ai Contact**
- **Technical Support**: tech@hotgigs.ai
- **Security Issues**: security@hotgigs.ai
- **General Inquiries**: hello@hotgigs.ai

---

*Last Updated: 2025-06-24*  
*Version: 1.0.0*  
*Domain: www.hotgigs.ai*

