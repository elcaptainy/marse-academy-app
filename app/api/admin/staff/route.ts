import { isAuthorized } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getStaffList, createStaffMember, deleteStaffMember } from '@/lib/db';



export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const staff = await getStaffList();
  return NextResponse.json(staff);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, email, role, password } = body;
    if (!name || !email || !role || !password) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }
    const staffMember = await createStaffMember({
      name,
      email,
      role,
      password // In mock local database we keep simple password verification
    });
    return NextResponse.json({ success: true, data: staffMember });
  } catch (error) {
    console.error('Failed to create staff member:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }
    await deleteStaffMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete staff member:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
