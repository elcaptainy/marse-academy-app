import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { updatePricingPlan, createPricingPlan, deletePricingPlan, reorderPricingPlans } from '@/lib/db';

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, price, period, features, isFeatured, badge } = body;

    const plan = await createPricingPlan({ 
      name: name || 'New Pathway', 
      description: description || 'Pathway description details.', 
      price: price || '$10,000', 
      period: period || '/yr', 
      features: features || ['Elite benefits included'], 
      isFeatured: isFeatured || false,
      badge: badge || 'NONE'
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error('Failed to create pricing plan:', error);
    return NextResponse.json({ success: false, error: 'Database creation failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (Array.isArray(body.orderedIds)) {
      const plans = await reorderPricingPlans(body.orderedIds);
      return NextResponse.json({ success: true, data: plans });
    }

    const { id, name, description, price, period, features, isFeatured, badge, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Pricing Plan ID required' }, { status: 400 });
    }

    const plan = await updatePricingPlan(id, { name, description, price, period, features, isFeatured, badge, order: typeof order === 'number' ? order : undefined });
    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error('Failed to update pricing plan:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Pricing Plan ID required' }, { status: 400 });
    }

    await deletePricingPlan(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete pricing plan:', error);
    return NextResponse.json({ success: false, error: 'Database deletion failed' }, { status: 500 });
  }
}
