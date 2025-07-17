import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { getGuests, addGuest, getGuestStats } from '@/lib/firestore';
import { Guest } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await requireAuth(request);
    
    if (decodedToken instanceof NextResponse) {
      return decodedToken; // This means auth failed
    }

    // Only allow admin access
    if (decodedToken.email !== '240designworks@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const guests = await getGuests();
    
    return NextResponse.json({
      success: true,
      data: guests
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const guestData: Omit<Guest, 'id'> = body;

    // Validate required fields
    if (!guestData.name || !guestData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const newGuest = await addGuest(guestData);
    
    return NextResponse.json({
      success: true,
      data: newGuest
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding guest:', error);
    return NextResponse.json(
      { error: 'Failed to add guest' },
      { status: 500 }
    );
  }
} 