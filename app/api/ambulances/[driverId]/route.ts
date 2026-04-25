import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

type UnitStatus = 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';

type UpdateAmbulanceBody = {
  status?: UnitStatus;
  currentLat?: number | null;
  currentLng?: number | null;
};

const allowedUnitStatuses = new Set<UnitStatus>(['AVAILABLE', 'DISPATCHED', 'OFF_DUTY']);

export async function PATCH(
  req: Request,
  context: { params: Promise<{ driverId: string }> }
) {
  try {
    const { driverId } = await context.params;
    const body = (await req.json()) as UpdateAmbulanceBody;

    const data: {
      status?: UnitStatus;
      currentLat?: number | null;
      currentLng?: number | null;
    } = {};

    if (body.status && allowedUnitStatuses.has(body.status)) {
      data.status = body.status;
    }

    if (body.currentLat !== undefined) {
      if (body.currentLat !== null && typeof body.currentLat !== 'number') {
        return NextResponse.json({ error: 'currentLat must be a number or null.' }, { status: 400 });
      }

      data.currentLat = body.currentLat;
    }

    if (body.currentLng !== undefined) {
      if (body.currentLng !== null && typeof body.currentLng !== 'number') {
        return NextResponse.json({ error: 'currentLng must be a number or null.' }, { status: 400 });
      }

      data.currentLng = body.currentLng;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No valid ambulance fields provided for update.' },
        { status: 400 }
      );
    }

    const ambulance = await prisma.driver.update({
      where: { id: driverId },
      data,
      include: {
        hospital: {
          select: {
            name: true,
          },
        },
        assignedCases: {
          where: {
            status: {
              not: 'RESOLVED',
            },
          },
          select: {
            id: true,
            status: true,
            aiSeverity: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: ambulance }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating ambulance unit:', error);
    return NextResponse.json(
      { error: 'Failed to update ambulance unit', details: message },
      { status: 500 }
    );
  }
}
