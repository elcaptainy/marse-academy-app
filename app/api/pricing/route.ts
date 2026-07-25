import { NextResponse } from 'next/server';
import { getPricingPlans } from '@/lib/db';

export async function GET() {
  const data = await getPricingPlans();
  return NextResponse.json(data);
}
