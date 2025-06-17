import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  
  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    
    console.log(`Received webhook: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  
  if (!userId) {
    console.error('No user_id in session metadata')
    return
  }

  try {
    // Handle one-time payment
    if (session.mode === 'payment') {
      const amountTotal = session.amount_total || 0
      const credits = calculateCreditsFromAmount(amountTotal)
      
      // Add credits to user account
      await addCreditsToUser(userId, credits, {
        type: 'purchase',
        stripe_session_id: session.id,
        amount: amountTotal,
        description: `Credit purchase - ${credits} credits`
      })
      
      console.log(`Added ${credits} credits to user ${userId}`)
    }
    
    // Handle subscription
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      await createOrUpdateSubscription(userId, subscription, session.customer as string)
      
      console.log(`Created subscription for user ${userId}`)
    }

  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id
  
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  try {
    await createOrUpdateSubscription(userId, subscription, subscription.customer as string)
    console.log(`Subscription created for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id
  
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  try {
    await createOrUpdateSubscription(userId, subscription, subscription.customer as string)
    console.log(`Subscription updated for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const { error } = await supabaseClient
      .from('subscriptions')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) throw error
    
    console.log(`Subscription cancelled: ${subscription.id}`)
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  
  if (!subscriptionId) return

  try {
    // Get subscription to find user
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const userId = subscription.metadata?.user_id
    
    if (!userId) {
      console.error('No user_id in subscription metadata')
      return
    }

    // Add monthly credits for subscription
    const credits = getSubscriptionCredits(subscription)
    
    await addCreditsToUser(userId, credits, {
      type: 'subscription',
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount: invoice.amount_paid || 0,
      description: `Monthly subscription credits - ${credits} credits`
    })
    
    console.log(`Added ${credits} subscription credits to user ${userId}`)
  } catch (error) {
    console.error('Error handling invoice paid:', error)
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string
  
  if (!subscriptionId) return

  try {
    // Update subscription status
    const { error } = await supabaseClient
      .from('subscriptions')
      .update({ 
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)

    if (error) throw error
    
    console.log(`Subscription payment failed: ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
  }
}

async function createOrUpdateSubscription(
  userId: string, 
  subscription: Stripe.Subscription,
  customerId: string
) {
  const subscriptionData = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    status: subscription.status,
    plan_type: getPlanTypeFromSubscription(subscription),
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
    metadata: subscription.metadata || {}
  }

  const { error } = await supabaseClient
    .from('subscriptions')
    .upsert(subscriptionData, { 
      onConflict: 'stripe_subscription_id',
      ignoreDuplicates: false 
    })

  if (error) throw error

  // Update user credits based on subscription
  const credits = getSubscriptionCredits(subscription)
  await updateUserCreditsForSubscription(userId, subscription.status, credits)
}

async function addCreditsToUser(
  userId: string, 
  credits: number, 
  transactionData: {
    type: string
    stripe_session_id?: string
    stripe_invoice_id?: string
    stripe_subscription_id?: string
    amount: number
    description: string
  }
) {
  // Add credits to user_credits table
  const { data: userCredits, error: fetchError } = await supabaseClient
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw fetchError
  }

  const currentCredits = userCredits?.credits_remaining || 0
  const newCredits = currentCredits + credits

  const { error: updateError } = await supabaseClient
    .from('user_credits')
    .upsert({
      user_id: userId,
      credits_remaining: newCredits,
      credits_used: userCredits?.credits_used || 0,
      updated_at: new Date().toISOString()
    })

  if (updateError) throw updateError

  // Record transaction
  const { error: transactionError } = await supabaseClient
    .from('credit_transactions')
    .insert({
      user_id: userId,
      transaction_type: 'credit',
      amount: credits,
      description: transactionData.description,
      metadata: {
        stripe_session_id: transactionData.stripe_session_id,
        stripe_invoice_id: transactionData.stripe_invoice_id,
        stripe_subscription_id: transactionData.stripe_subscription_id,
        payment_amount: transactionData.amount
      }
    })

  if (transactionError) throw transactionError
}

async function updateUserCreditsForSubscription(
  userId: string, 
  status: string, 
  monthlyCredits: number
) {
  const planType = status === 'active' ? 'pro' : 'free'
  const monthlyLimit = status === 'active' ? monthlyCredits : 1000

  const { error } = await supabaseClient
    .from('user_credits')
    .upsert({
      user_id: userId,
      plan_type: planType,
      monthly_limit: monthlyLimit,
      updated_at: new Date().toISOString()
    })

  if (error) throw error
}

function calculateCreditsFromAmount(amountInCents: number): number {
  // Convert cents to dollars and calculate credits
  // Example: $10 = 1000 credits, $25 = 2500 credits, etc.
  const dollars = amountInCents / 100
  return Math.floor(dollars * 100)
}

function getPlanTypeFromSubscription(subscription: Stripe.Subscription): string {
  // Extract plan type from subscription items
  const priceId = subscription.items.data[0]?.price.id
  
  // Map price IDs to plan types (you'll need to update these with your actual Stripe price IDs)
  const planMapping: Record<string, string> = {
    'price_basic': 'basic',
    'price_pro': 'pro',
    'price_enterprise': 'enterprise'
  }
  
  return planMapping[priceId || ''] || 'basic'
}

function getSubscriptionCredits(subscription: Stripe.Subscription): number {
  const planType = getPlanTypeFromSubscription(subscription)
  
  // Define credits per plan
  const creditsMapping: Record<string, number> = {
    'basic': 5000,
    'pro': 15000,
    'enterprise': 50000
  }
  
  return creditsMapping[planType] || 5000
}