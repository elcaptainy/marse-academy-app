import { NextResponse } from 'next/server';
import { getBentoGallery } from '@/lib/db';

export async function GET() {
  const data = await getBentoGallery();
  return NextResponse.json(data);
}
