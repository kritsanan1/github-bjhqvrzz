# 🛠️ InkAI Studio - Development Scripts Guide

## 📋 Overview
This document provides comprehensive information about all available npm scripts, their purposes, usage patterns, and troubleshooting guidance for the InkAI Studio project.

## 🚀 Core Development Scripts

### `npm run dev`
**Purpose**: Starts the Vite development server with hot module replacement

**Command**: `vite`

**Usage**:
```bash
npm run dev
# or
yarn dev
```

**Environment**: Development only

**Expected Output**:
```
  VITE v5.4.2  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Features**:
- Hot Module Replacement (HMR)
- TypeScript compilation
- Tailwind CSS processing
- Security headers in development
- Source maps enabled

**Troubleshooting**:
- **Port 5173 in use**: Vite will automatically try the next available port
- **TypeScript errors**: Check `tsconfig.json` configuration
- **Tailwind not working**: Verify `postcss.config.js` and `tailwind.config.js`

---

### `npm run build`
**Purpose**: Creates optimized production build

**Command**: `vite build`

**Usage**:
```bash
npm run build
```

**Environment**: Production

**Expected Output**:
```
vite v5.4.2 building for production...
✓ 1234 modules transformed.
dist/index.html                   1.23 kB │ gzip:  0.67 kB
dist/assets/index-a1b2c3d4.css   45.67 kB │ gzip: 12.34 kB
dist/assets/index-e5f6g7h8.js   234.56 kB │ gzip: 78.90 kB
✓ built in 5.67s
```

**Build Features**:
- Code minification with Terser
- Tree shaking for unused code
- CSS optimization and purging
- Asset optimization and hashing
- Source maps disabled for security
- Console logs removed in production

**Output Directory**: `dist/`

**Performance Targets**:
- Initial bundle: < 200KB gzipped
- Total assets: < 1MB gzipped
- Build time: < 30 seconds

**Troubleshooting**:
- **Build fails**: Check TypeScript errors with `npm run lint`
- **Large bundle size**: Use `npm run analyze` to identify issues
- **Missing assets**: Verify import paths and public folder structure

---

### `npm run preview`
**Purpose**: Preview production build locally

**Command**: `vite preview`

**Usage**:
```bash
npm run build && npm run preview
```

**Expected Output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

**Use Cases**:
- Test production build before deployment
- Verify optimizations work correctly
- Check for production-only issues

---

### `npm run lint`
**Purpose**: Run ESLint for code quality and consistency

**Command**: `eslint .`

**Usage**:
```bash
npm run lint
```

**Configuration**: `eslint.config.js`

**Checks**:
- TypeScript type errors
- React hooks rules
- Code style consistency
- Security best practices
- Unused variables and imports

**Expected Output** (success):
```
✨ No linting errors found!
```

**Expected Output** (with errors):
```
src/components/Example.tsx
  12:5  error  'useState' is not defined  no-undef
  15:3  warning  Unused variable 'data'   @typescript-eslint/no-unused-vars

✖ 2 problems (1 error, 1 warning)
```

**Auto-fix**:
```bash
npm run lint -- --fix
```

---

## 🔒 Security Scripts

### `npm run security:scan`
**Purpose**: Comprehensive security vulnerability scanning

**Command**: `node scripts/security-scan.js`

**Usage**:
```bash
npm run security:scan
```

**Features**:
- **Snyk Integration**: Dependency vulnerability scanning
- **OWASP ZAP**: Dynamic application security testing
- **Static Analysis**: Code pattern security checks
- **Report Generation**: Detailed security reports

**Prerequisites**:
```bash
# Set environment variables
export SNYK_API_KEY=your_snyk_api_key
export OWASP_ZAP_URL=http://localhost:8080
```

**Expected Output**:
```
🚀 Starting comprehensive security scan...

🔍 Running static security analysis...
✅ Static analysis completed. Found 0 potential issues.

🔍 Running Snyk vulnerability scan...
✅ Snyk scan completed. Found 0 vulnerabilities.

🔍 Running OWASP ZAP scan...
✅ OWASP ZAP scan completed. Found 0 alerts.

📊 Security Scan Report
========================

✅ No vulnerabilities found!

📄 Detailed report saved to: ./security-report.json
```

**Report Location**: `./security-report.json`

**Troubleshooting**:
- **Snyk API key missing**: Set `SNYK_API_KEY` environment variable
- **OWASP ZAP not running**: Start ZAP proxy on port 8080
- **High severity issues**: Review and fix before deployment

---

### `npm run security:check`
**Purpose**: Quick security configuration validation

**Command**: `npm audit && node scripts/vulnerability-check.js`

**Usage**:
```bash
npm run security:check
```

**Checks**:
- **npm audit**: Known vulnerabilities in dependencies
- **Security headers**: Proper CSP and security header configuration
- **Environment security**: .env file validation
- **Build security**: Production build security settings

**Expected Output**:
```
🚀 Starting vulnerability check...

🔍 Checking security headers configuration...
🔍 Checking dependencies for known vulnerabilities...
🔍 Checking security implementation...
🔍 Checking environment security...
🔍 Checking build security configuration...

📊 Vulnerability Check Report
===============================

✅ No security issues found!

📄 Detailed report saved to: ./vulnerability-report.json
```

**Exit Codes**:
- `0`: No issues found
- `1`: High severity issues found

---

## 🧪 Testing Scripts

### `npm test` (Future Implementation)
**Purpose**: Run unit and integration tests

**Planned Implementation**:
```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

**Testing Stack** (Planned):
- **Vitest**: Fast unit testing
- **Testing Library**: React component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

---

## 📊 Analysis Scripts

### `npm run analyze` (Future Implementation)
**Purpose**: Bundle size analysis and optimization

**Planned Command**: `vite-bundle-analyzer`

**Usage**:
```bash
npm run analyze
```

**Features**:
- Bundle size visualization
- Dependency analysis
- Optimization suggestions
- Performance metrics

---

## 🔧 Utility Scripts

### Custom Script Examples

**Database Migration** (Future):
```bash
npm run db:migrate
npm run db:seed
npm run db:reset
```

**Code Generation**:
```bash
npm run generate:component ComponentName
npm run generate:page PageName
npm run generate:hook useHookName
```

**Documentation**:
```bash
npm run docs:build
npm run docs:serve
npm run docs:deploy
```

## 🚨 Troubleshooting Guide

### Common Issues

**1. Port Already in Use**
```bash
# Error: Port 5173 is already in use
# Solution: Kill process or use different port
lsof -ti:5173 | xargs kill -9
# or
npm run dev -- --port 3000
```

**2. TypeScript Compilation Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
# Fix configuration in tsconfig.json
```

**3. Dependency Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. Build Failures**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

**5. Security Scan Failures**
```bash
# Update dependencies
npm audit fix
# Review security report
cat security-report.json
```

### Performance Optimization

**Bundle Size Issues**:
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist/assets/*.js
```

**Build Time Issues**:
```bash
# Enable build profiling
npm run build -- --profile
```

### Environment-Specific Issues

**Development**:
- Check `.env` file exists and is properly configured
- Verify all required environment variables are set
- Ensure development dependencies are installed

**Production**:
- Verify production environment variables
- Check security headers are properly configured
- Ensure all assets are properly optimized

## 📝 Script Customization

### Adding New Scripts

**1. Add to package.json**:
```json
{
  "scripts": {
    "custom:script": "your-command-here"
  }
}
```

**2. Document in this file**:
- Purpose and usage
- Expected output
- Troubleshooting steps
- Dependencies and prerequisites

### Script Naming Conventions

- **Namespace with colons**: `test:unit`, `build:prod`
- **Use descriptive names**: `security:scan` not `sec`
- **Group related scripts**: `db:migrate`, `db:seed`, `db:reset`

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run security:check
      - run: npm run build
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run security:check",
      "pre-push": "npm run build"
    }
  }
}
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: InkAI Studio Development Team