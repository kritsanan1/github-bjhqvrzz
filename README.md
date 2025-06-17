# 🎨 InkAI Studio - AI-Powered Tattoo Design Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue.svg)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-Enhanced-green.svg)](#security-features)
[![Stripe](https://img.shields.io/badge/Stripe-Integrated-purple.svg)](#stripe-integration)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Project Overview

InkAI Studio is a revolutionary AI-powered tattoo design platform that combines cutting-edge artificial intelligence with master artistry. The platform enables users to create unique, personalized tattoo designs through an intuitive interface while maintaining the highest standards of security and user experience.

### ✨ Key Features

- **🤖 AI-Powered Design Generation**: Advanced SDXL Fresh Ink model creates unique designs
- **🎨 Professional Artist Collaboration**: Master artists refine AI concepts with traditional techniques
- **💳 Secure Payment Processing**: Stripe integration with Supabase Edge Functions
- **📱 Responsive Design**: Seamless experience across all devices
- **🔒 Enterprise-Grade Security**: Comprehensive security measures including XSS protection, CSRF tokens, and input sanitization
- **⚡ Real-time Visualization**: AR body placement preview before committing
- **💰 Dynamic Pricing Calculator**: Interactive pricing with real-time estimates
- **🎯 Body Placement Tools**: Interactive body mapping for optimal tattoo placement
- **🖼️ Smart Gallery**: Advanced filtering and search capabilities

### 🛠️ Technology Stack

**Frontend Framework**
- React 18.3.1 with TypeScript 5.5.3
- Vite 5.4.2 for fast development and building

**Styling & UI**
- Tailwind CSS 3.4.1 for utility-first styling
- Framer Motion 11.3.0 for smooth animations
- Lucide React 0.344.0 for consistent iconography

**Backend & Database**
- Supabase for database and authentication
- Supabase Edge Functions for serverless API endpoints
- PostgreSQL with Row Level Security (RLS)

**AI Integration**
- Replicate API with SDXL Fresh Ink model
- Custom tattoo-optimized prompts and parameters

**Payment Processing**
- Stripe for secure payment processing
- Webhook handling for real-time payment updates
- Subscription and one-time payment support

**Forms & Validation**
- React Hook Form 7.47.0 for optimized form performance
- Zod 3.22.4 for type-safe schema validation
- Custom security hooks with CSRF protection

**Security**
- DOMPurify 3.0.5 for XSS prevention
- Custom security utilities for input sanitization
- Rate limiting and CSRF token management

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or yarn 1.22.0+)
- **Supabase Account**: For database and Edge Functions
- **Stripe Account**: For payment processing
- **Replicate Account**: For AI image generation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/inkai-studio.git
   cd inkai-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_NAME=InkAI Studio
   VITE_APP_VERSION=1.0.0
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup section)
   - Deploy the Edge Functions (see Stripe Integration section)

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database Setup

The application uses Supabase PostgreSQL with the following key tables:

- `profiles` - User profile information
- `user_credits` - Credit balance and subscription info
- `generated_images` - AI-generated tattoo designs
- `subscriptions` - Stripe subscription data
- `credit_transactions` - Payment and credit history

### Database Schema

Key tables and their relationships:

```sql
-- Users and profiles
profiles (id, username, full_name, avatar_url, stripe_customer_id)
user_credits (user_id, credits_remaining, plan_type, monthly_limit)

-- AI-generated content
generated_images (id, user_id, prompt, model, image_url, parameters)
collections (id, user_id, name, description, is_public)

-- Payment and subscriptions
subscriptions (id, user_id, stripe_subscription_id, status, plan_type)
credit_transactions (id, user_id, transaction_type, amount, description)
```

## 💳 Stripe Integration

### Edge Functions Setup

The application uses Supabase Edge Functions for secure payment processing:

1. **Deploy Stripe Checkout Function**
   ```bash
   supabase functions deploy stripe-checkout
   ```

2. **Deploy Stripe Webhook Function**
   ```bash
   supabase functions deploy stripe-webhook
   ```

3. **Set Supabase Secrets**
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### Stripe Configuration

1. **Create Products and Prices**
   - Set up your products in Stripe Dashboard
   - Note the price IDs for use in the application

2. **Configure Webhooks**
   - Add webhook endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, etc.

3. **Update Price IDs**
   - Replace placeholder price IDs in `src/pages/Pricing.tsx`
   - Update the price mapping in the webhook function

### Payment Flow

1. User selects a package or subscription
2. Frontend calls `stripe-checkout` Edge Function
3. User is redirected to Stripe Checkout
4. After payment, Stripe sends webhook to `stripe-webhook` function
5. Webhook updates database with subscription/credit information
6. User is redirected to success page

## 🤖 AI Integration

### Replicate API Setup

The application uses the SDXL Fresh Ink model for tattoo design generation:

1. **Get Replicate API Key**
   - Sign up at [Replicate](https://replicate.com)
   - Get your API token

2. **Configure API**
   ```typescript
   // src/api/replicate.ts
   const replicate = new Replicate({
     auth: 'your_replicate_api_key',
   });
   ```

### AI Features

- **Tattoo-Optimized Prompts**: Custom prompts for different tattoo styles
- **Body Placement Optimization**: Adjust dimensions based on body placement
- **Style Variations**: Generate multiple variations of designs
- **High-Quality Output**: Optimized for tattoo printing and application

## 🔒 Security Features

InkAI Studio implements enterprise-grade security measures:

### Input Sanitization
- **XSS Protection**: All user inputs are sanitized using DOMPurify
- **SQL Injection Prevention**: Parameterized queries and input validation
- **Content Security Policy**: Strict CSP headers prevent code injection

### Authentication & Authorization
- **Supabase Auth**: Secure authentication with email/password
- **Row Level Security**: Database-level access control
- **CSRF Protection**: Automatic CSRF token generation and validation
- **Rate Limiting**: Prevents brute force attacks and abuse

### Payment Security
- **Stripe Integration**: PCI-compliant payment processing
- **Webhook Verification**: Cryptographic verification of Stripe webhooks
- **Secure Edge Functions**: Server-side payment processing

## 🧪 Testing Strategy

### Development Testing
```bash
# Run linting
npm run lint

# Run security scan
npm run security:scan

# Run vulnerability check
npm run security:check
```

### Security Testing
```bash
# Comprehensive security scan
npm run security:scan

# Vulnerability assessment
npm run security:check
```

## 🚀 Deployment

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
```env
# Production Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_NAME=InkAI Studio
VITE_DEBUG_MODE=false
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Supabase Edge Functions deployed
- [ ] Stripe webhooks configured
- [ ] Database migrations applied
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error logging configured

## 📊 Performance Metrics

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Targets
- **Initial Bundle**: < 200KB gzipped
- **Total Bundle**: < 1MB gzipped
- **Chunk Size**: < 100KB per chunk

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow Code Standards**
   - Use TypeScript for all new code
   - Follow ESLint configuration
   - Write comprehensive tests
   - Update documentation

3. **Security Requirements**
   - Sanitize all user inputs
   - Validate all form data
   - Follow security best practices
   - Run security scans before PR

4. **Submit Pull Request**
   - Provide clear description
   - Include test coverage
   - Update relevant documentation
   - Ensure all checks pass

## 📞 Support & Contact

### Development Team
- **Lead Developer**: [Your Name](mailto:dev@inkaistudio.com)
- **Security Team**: [Security Contact](mailto:security@inkaistudio.com)
- **DevOps**: [DevOps Contact](mailto:devops@inkaistudio.com)

### Emergency Contacts
- **Production Issues**: [Emergency Contact](tel:+1-555-0123)
- **Security Incidents**: [Security Hotline](tel:+1-555-0124)

### Documentation
- **API Documentation**: [API Docs](https://docs.inkaistudio.com)
- **Design System**: [Design Guide](https://design.inkaistudio.com)
- **Security Policies**: [Security Docs](https://security.inkaistudio.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the InkAI Studio Team**

*Where AI Meets Artistry*