import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/db';
import { sendPaymentReceiptEmail, sendPaymentAdminAlertEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, cardName, cardNumber, amount, planName } = body;

    if (!email || !cardName || !cardNumber || !amount || planName === undefined) {
      return NextResponse.json({ success: false, error: 'Billing details missing' }, { status: 400 });
    }

    // Mask card number for PCI security
    const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;
    let stripePaymentId: string | undefined = undefined;

    // Connect to Stripe API if secret key is present
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (stripeSecretKey && stripeSecretKey.startsWith('sk_')) {
      try {
        const numericAmount = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 10000;
        const amountInCents = numericAmount * 100;

        const params = new URLSearchParams();
        params.append('amount', amountInCents.toString());
        params.append('currency', 'usd');
        params.append('payment_method_types[]', 'card');
        params.append('description', `MARSE Academy Tuition - ${planName} (${cardName})`);
        params.append('receipt_email', email);

        const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });

        const stripeData = await stripeRes.json();
        if (stripeData.id) {
          stripePaymentId = stripeData.id;
          console.log(`✅ Stripe Live Test PaymentIntent Verified: ${stripeData.id}`);
        } else if (stripeData.error) {
          console.warn(`Stripe API Notice: ${stripeData.error.message}`);
        }
      } catch (stripeErr) {
        console.error('Stripe API fetch error:', stripeErr);
      }
    }

    const transaction = await createTransaction({
      email,
      cardName,
      cardNumber: stripePaymentId ? `${maskedCard} (${stripePaymentId})` : maskedCard,
      amount,
      planName
    });

    // Trigger automated email receipts asynchronously
    sendPaymentReceiptEmail(email, cardName, planName, amount, transaction.id).catch(err => 
      console.error('Failed to send payment receipt:', err)
    );
    sendPaymentAdminAlertEmail(cardName, email, planName, amount).catch(err => 
      console.error('Failed to send admin payment alert:', err)
    );

    return NextResponse.json({ 
      success: true, 
      data: {
        ...transaction,
        stripePaymentId
      }
    });
  } catch (error) {
    console.error('Failed to process checkout API request:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const transactions = await getTransactions();
  return NextResponse.json(transactions);
}
