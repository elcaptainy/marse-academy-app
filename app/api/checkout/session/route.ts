import { NextRequest, NextResponse } from 'next/server';
import { createTransaction } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planName, amount, email, cardName } = body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
      return NextResponse.json({
        success: false,
        error: 'Stripe secret key missing in server environment variables.'
      }, { status: 400 });
    }

    // Convert amount e.g. "$48,000" or "$10,000" into numeric cents
    const numericAmount = parseInt(String(amount || '48000').replace(/[^0-9]/g, ''), 10) || 48000;
    const amountInCents = numericAmount * 100;

    const params = new URLSearchParams();
    params.append('payment_method_types[0]', 'card');
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][product_data][name]', `MARSE Academy — ${planName || 'Tuition Fee'}`);
    params.append('line_items[0][price_data][product_data][description]', 'Official Admission & Enrollment Deposit for Marse Academy of Fashion & Arts');
    params.append('line_items[0][price_data][unit_amount]', amountInCents.toString());
    params.append('line_items[0][quantity]', '1');
    params.append('mode', 'payment');
    params.append('customer_email', email || undefined);
    params.append('success_url', `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${origin}/checkout`);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const sessionData = await stripeRes.json();

    if (sessionData.url) {
      // Record draft transaction
      await createTransaction({
        email: email || 'pending@stripe.com',
        cardName: cardName || 'Stripe Checkout User',
        cardNumber: `Stripe Session (${sessionData.id})`,
        amount: amount || `$${numericAmount.toLocaleString()}`,
        planName: planName || 'Tuition Fee'
      }).catch(err => console.error('Failed to log draft transaction:', err));

      return NextResponse.json({ success: true, url: sessionData.url, sessionId: sessionData.id });
    } else {
      console.error('Stripe Checkout Session Error:', sessionData.error);
      return NextResponse.json({
        success: false,
        error: sessionData.error?.message || 'Failed to create Stripe Checkout Session'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Stripe Session Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
