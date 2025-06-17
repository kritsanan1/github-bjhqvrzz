import { z } from 'zod';
import { sanitizeInput } from './security';

// Base validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(254, 'Email too long')
  .transform(sanitizeInput);

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters')
  .transform(sanitizeInput);

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number too short')
  .max(20, 'Phone number too long')
  .transform(sanitizeInput);

// Form validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
  csrfToken: z.string().min(1, 'CSRF token required')
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  csrfToken: z.string().min(1, 'CSRF token required')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject too long')
    .transform(sanitizeInput),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message too long')
    .transform(sanitizeInput),
  csrfToken: z.string().min(1, 'CSRF token required')
});

export const designRequestSchema = z.object({
  style: z.enum(['traditional', 'realistic', 'geometric', 'abstract', 'minimalist', 'neo-traditional']),
  size: z.enum(['small', 'medium', 'large', 'xlarge']),
  placement: z.enum(['arm', 'shoulder', 'back', 'chest', 'leg', 'wrist', 'neck', 'ankle']),
  complexity: z.enum(['simple', 'medium', 'complex', 'highly-detailed']),
  color: z.enum(['blackgray', 'color']),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description too long')
    .transform(sanitizeInput),
  budget: z.number().min(50).max(5000),
  csrfToken: z.string().min(1, 'CSRF token required')
});

export const pricingCalculatorSchema = z.object({
  size: z.enum(['small', 'medium', 'large', 'xlarge']),
  complexity: z.enum(['simple', 'medium', 'complex', 'highly-detailed']),
  color: z.enum(['blackgray', 'color']),
  placement: z.enum(['arm', 'shoulder', 'back', 'chest', 'leg', 'wrist', 'neck', 'ankle']),
  style: z.enum(['traditional', 'realistic', 'geometric', 'abstract', 'minimalist', 'neo-traditional']),
  aiEnhancement: z.boolean(),
  artistCollaboration: z.boolean()
});

// Validation helper functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type DesignRequestData = z.infer<typeof designRequestSchema>;
export type PricingCalculatorData = z.infer<typeof pricingCalculatorSchema>;