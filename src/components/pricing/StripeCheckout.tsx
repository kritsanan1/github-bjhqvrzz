import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { useStripe } from '../../hooks/useStripe';

interface StripeCheckoutProps {
  priceId: string;
  userId: string;
  planName: string;
  amount: number;
  mode?: 'payment' | 'subscription';
  className?: string;
  children?: React.ReactNode;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  priceId,
  userId,
  planName,
  amount,
  mode = 'payment',
  className = '',
  children
}) => {
  const { loading, error, redirectToCheckout } = useStripe();

  const handleCheckout = async () => {
    if (!userId) {
      alert('Please log in to continue with payment');
      return;
    }

    await redirectToCheckout({
      priceId,
      userId,
      mode,
      metadata: {
        plan_name: planName,
        amount: amount.toString(),
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !userId}
        className={`
          w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${className || 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/25'}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>{children || `Pay $${amount}`}</span>
          </>
        )}
      </button>

      <div className="text-center text-xs text-gray-500">
        Secure payment powered by Stripe
      </div>
    </div>
  );
};

export default StripeCheckout;