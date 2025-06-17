import { useEffect, useState } from 'react';
import { useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { setCSRFToken, rateLimiter } from '../utils/security';

interface UseSecureFormOptions<T> extends UseFormProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  rateLimitKey?: string;
  maxAttempts?: number;
}

export const useSecureForm = <T extends Record<string, any>>({
  schema,
  onSubmit,
  rateLimitKey = 'form-submit',
  maxAttempts = 5,
  ...formOptions
}: UseSecureFormOptions<T>) => {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...formOptions
  });

  // Initialize CSRF token
  useEffect(() => {
    const token = setCSRFToken();
    setCsrfToken(token);
    form.setValue('csrfToken' as any, token);
  }, [form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    // Rate limiting check
    if (!rateLimiter.isAllowed(rateLimitKey, maxAttempts)) {
      setIsRateLimited(true);
      form.setError('root', {
        type: 'manual',
        message: 'Too many attempts. Please try again later.'
      });
      return;
    }

    setSubmitAttempts(prev => prev + 1);

    try {
      await onSubmit(data);
      // Reset rate limiter on successful submission
      rateLimiter.reset(rateLimitKey);
      setSubmitAttempts(0);
    } catch (error) {
      console.error('Form submission error:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Submission failed. Please try again.'
      });
    }
  });

  const resetRateLimit = () => {
    rateLimiter.reset(rateLimitKey);
    setIsRateLimited(false);
    setSubmitAttempts(0);
  };

  return {
    ...form,
    handleSubmit,
    csrfToken,
    isRateLimited,
    submitAttempts,
    resetRateLimit,
    maxAttempts
  };
};