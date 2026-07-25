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

    // Mask card number
    const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;

    const transaction = await createTransaction({
      email,
      cardName,
      cardNumber: maskedCard,
      amount,
      planName
    });

    // Trigger automated emails asynchronously in the background
    sendPaymentReceiptEmail(email, cardName, planName, amount, transaction.id).catch(err => 
      console.error('Failed to send payment receipt:', err)
    );
    sendPaymentAdminAlertEmail(cardName, email, planName, amount).catch(err => 
      console.error('Failed to send admin payment alert:', err)
    );

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error('Failed to process checkout API request:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const transactions = await getTransactions();
  return NextResponse.json(transactions);
}
