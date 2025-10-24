# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depend on the severity of the vulnerability.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🐛 Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email**: [security@yourdomain.com](mailto:security@yourdomain.com)
2. **GitHub Security Advisories**: Use the "Security" tab on the GitHub repository

### What to Include

When reporting a vulnerability, please include:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 30 days
  - Medium: Within 90 days
  - Low: Next release cycle

## 🛡️ Security Measures

### Current Security Implementations

1. **Authentication**
   - Supabase Auth with JWT
   - Secure session management
   - Password hashing with bcrypt

2. **Database**
   - Row Level Security (RLS) enabled on all tables
   - Prepared statements (SQL injection protection)
   - Input validation and sanitization

3. **API Security**
   - CORS configuration
   - Rate limiting (recommended in production)
   - Environment variables for secrets

4. **Frontend**
   - XSS protection
   - CSRF tokens (Supabase handles)
   - Content Security Policy (recommended)

### Best Practices

- Always use HTTPS in production
- Never commit secrets to Git
- Use environment variables for sensitive data
- Keep dependencies up to date (Dependabot enabled)
- Regular security audits

## 🔄 Security Updates

We use Dependabot to automatically check for vulnerable dependencies. Security updates are released as soon as possible after a vulnerability is confirmed.

## 📝 Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported releases
4. Release new security patch versions

## 🙏 Acknowledgments

We appreciate the security research community's efforts to help keep Builder Hub and its users safe. Responsible disclosure of security vulnerabilities helps us ensure the security and privacy of our users.

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

**Last Updated**: January 2025
