import { NextResponse } from 'next/server';
import { getCurriculumFeatures } from '@/lib/db';

export async function GET() {
  const data = await getCurriculumFeatures();
  return NextResponse.json(data);
}
