import { useState } from 'react';

interface CheckoutParams {
  priceId: string;
  userId: string;
  quantity?: number;
  metadata?: Record<string, string>;
  mode?: 'payment' | 'subscription';
}

interface CheckoutResponse {
  sessionId: string;
  url: string;
  customerId: string;
}

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (params: CheckoutParams): Promise<CheckoutResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ...params,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data: CheckoutResponse = await response.json();
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Stripe checkout error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (params: CheckoutParams) => {
    const session = await createCheckoutSession(params);
    return session;
  };

  return {
    loading,
    error,
    createCheckoutSession,
    redirectToCheckout,
  };
};