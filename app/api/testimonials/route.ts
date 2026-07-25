import { NextResponse } from 'next/server';
import { getTestimonials } from '@/lib/db';

export async function GET() {
  const data = await getTestimonials();
  return NextResponse.json(data);
}
