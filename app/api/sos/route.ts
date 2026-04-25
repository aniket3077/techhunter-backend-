import { NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';

// POST /api/sos
// Payload: { userId, locationLat, locationLng, imageUrls?, aiSeverity?, aiDescription? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, locationLat, locationLng, imageUrls, aiSeverity, aiDescription } = body;

    if (!userId || locationLat === undefined || locationLng === undefined) {
      return NextResponse.json({ error: 'Missing required fields (userId, locationLat, locationLng)' }, { status: 400 });
    }

    // Create the emergency case in the database
    const emergencyCase = await prisma.emergencyCase.create({
      data: {
        userId,
        locationLat,
        locationLng,
        imageUrls: imageUrls || [],
        aiSeverity: aiSeverity || 'PENDING',
        aiDescription: aiDescription || '',
      },
    });

    // TODO: Emit realtime event via Pusher to notify nearby Police / Drivers

    return NextResponse.json({ success: true, data: emergencyCase }, { status: 201 });
  } catch (error: any) {
    console.error('Error in /api/sos:', error);
    return NextResponse.json({ error: 'Failed to create emergency case', details: error.message }, { status: 500 });
  }
}
