import { NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';

// GET /api/cases
// Fetch active emergency cases. Can filter by status if provided in query params.
export const dynamic = 'force-dynamic'; // Prevent static caching for this route

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query: any = {
      include: {
        user: {
          select: { name: true, phone: true, bloodType: true, medicalHistory: true }
        },
        assignedDriver: true,
        assignedPolice: true,
      },
      orderBy: { createdAt: 'desc' }
    };

    if (status) {
      // Assuming status is one of PENDING, DISPATCHED, RESOLVED
      query.where = { status: status as any };
    }

    const cases = await prisma.emergencyCase.findMany(query);

    return NextResponse.json({ success: true, data: cases }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases', details: error.message }, { status: 500 });
  }
}
