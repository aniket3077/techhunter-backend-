import { NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';

type CreateSosBody = {
  userId?: string;
  locationLat?: number;
  locationLng?: number;
  imageUrls?: string[];
  aiSeverity?: string;
  aiDescription?: string;
};

// POST /api/sos
// Payload: { userId, locationLat, locationLng, imageUrls?, aiSeverity?, aiDescription? }
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateSosBody;
    const { userId, locationLat, locationLng, imageUrls, aiSeverity, aiDescription } = body;

    if (
      !userId ||
      typeof locationLat !== 'number' ||
      typeof locationLng !== 'number'
    ) {
      return NextResponse.json({ error: 'Missing required fields (userId, locationLat, locationLng)' }, { status: 400 });
    }

    // Create the emergency case in the database
    const emergencyCase = await prisma.emergencyCase.create({
      data: {
        userId,
        locationLat,
        locationLng,
        imageUrls: imageUrls || [],
        aiSeverity: aiSeverity?.toUpperCase() || 'ANALYZING',
        aiDescription: aiDescription?.trim() || '',
      },
    });

    // TODO: Emit realtime event via Pusher to notify nearby Police / Drivers

    return NextResponse.json({ success: true, data: emergencyCase }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in /api/sos:', error);
    return NextResponse.json({ error: 'Failed to create emergency case', details: message }, { status: 500 });
  }
}
