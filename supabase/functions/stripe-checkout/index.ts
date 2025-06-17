import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CheckoutRequest {
  priceId: string
  userId: string
  quantity?: number
  metadata?: Record<string, string>
  successUrl?: string
  cancelUrl?: string
  mode?: 'payment' | 'subscription'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      priceId, 
      userId, 
      quantity = 1, 
      metadata = {}, 
      successUrl,
      cancelUrl,
      mode = 'payment'
    }: CheckoutRequest = await req.json()

    // Validate required fields
    if (!priceId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: priceId and userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user profile from Supabase
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if customer already exists in Stripe
    let customerId = null
    if (profile.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: profile.email || `${userId}@inkaistudio.com`,
        name: profile.full_name || profile.username || 'InkAI User',
        metadata: {
          supabase_user_id: userId,
        },
      })
      customerId = customer.id

      // Update profile with Stripe customer ID
      await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: mode,
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/pricing`,
      metadata: {
        user_id: userId,
        ...metadata,
      },
      // For subscriptions, add trial period if needed
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: {
            user_id: userId,
          },
        },
      }),
      // For one-time payments, add invoice metadata
      ...(mode === 'payment' && {
        invoice_creation: {
          enabled: true,
          invoice_data: {
            metadata: {
              user_id: userId,
            },
          },
        },
      }),
    })

    // Log the checkout session creation
    console.log(`Checkout session created: ${session.id} for user: ${userId}`)

    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url,
        customerId: customerId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})