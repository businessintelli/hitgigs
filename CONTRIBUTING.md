# Contributing to HotGigs.ai

Thank you for your interest in contributing to HotGigs.ai! We welcome contributions from the community and are excited to see what you'll bring to this AI-powered job portal platform.

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git
- PostgreSQL (via Supabase)
- OpenAI API access

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/hitgigs.git`
3. Set up the development environment (see README.md)
4. Create a new branch: `git checkout -b feature/your-feature-name`

## 📋 How to Contribute

### 🐛 Reporting Bugs
- Use the GitHub issue tracker
- Include detailed steps to reproduce
- Provide system information (OS, Python/Node versions)
- Include error messages and logs

### 💡 Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Include mockups or examples if applicable

### 🔧 Code Contributions

#### Backend (Flask/Python)
- Follow PEP 8 style guidelines
- Add type hints where appropriate
- Include docstrings for functions and classes
- Write unit tests for new features
- Update API documentation

#### Frontend (React/TypeScript)
- Use TypeScript for all new components
- Follow React best practices and hooks patterns
- Ensure components are responsive and accessible
- Add proper error handling
- Include component documentation

#### AI Features
- Test AI features thoroughly with various inputs
- Consider bias and fairness in AI implementations
- Document AI model parameters and decisions
- Include performance benchmarks

## 🧪 Testing

### Backend Testing
```bash
cd backend/hotgigs-api
source venv/bin/activate
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend/hotgigs-frontend
npm test
```

### AI Feature Testing
- Test with diverse resume formats and content
- Validate job matching accuracy
- Ensure interview agent responses are appropriate
- Check for bias in AI recommendations

## 📝 Code Style

### Python
- Use Black for code formatting: `black .`
- Use flake8 for linting: `flake8 .`
- Use mypy for type checking: `mypy .`

### TypeScript/React
- Use Prettier for formatting: `npm run format`
- Use ESLint for linting: `npm run lint`
- Follow React/TypeScript best practices

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(ai): add resume analysis endpoint
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
```

## 🔒 Security

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Follow OWASP security guidelines
- Report security vulnerabilities privately

## 📚 Documentation

- Update README.md for significant changes
- Add inline code comments for complex logic
- Update API documentation for new endpoints
- Include examples in documentation

## 🎯 Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Ensure all tests pass

3. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Use the PR template
   - Include screenshots for UI changes
   - Reference related issues
   - Request review from maintainers

## 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `ai-feature` - Related to AI functionality
- `frontend` - Frontend-related issues
- `backend` - Backend-related issues

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Ask questions if you're unsure

## 📞 Getting Help

- Join our Discord community
- Ask questions in GitHub Discussions
- Tag maintainers in issues for urgent matters
- Check existing issues and documentation first

## 🎉 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Invited to the contributors' Discord channel
- Eligible for contributor swag (coming soon!)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HotGigs.ai! Together, we're building the future of AI-powered recruitment. 🚀

