import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

type UnitStatus = 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';

const allowedUnitStatuses = new Set<UnitStatus>(['AVAILABLE', 'DISPATCHED', 'OFF_DUTY']);

export const dynamic = 'force-dynamic';

function getRecommendedAction(status: UnitStatus, activeAssignmentCount: number) {
  if (status === 'DISPATCHED') {
    return 'Navigation active';
  }

  if (status === 'OFF_DUTY') {
    return 'Await shift handover';
  }

  return activeAssignmentCount > 0 ? 'Review assignment queue' : 'Ready for smart dispatch';
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query: {
      where?: {
        status?: UnitStatus;
      };
      include: {
        hospital: {
          select: {
            name: true;
          };
        };
        assignedCases: {
          where: {
            status: {
              not: 'RESOLVED';
            };
          };
          select: {
            id: true;
            status: true;
            aiSeverity: true;
            createdAt: true;
            locationLat: true;
            locationLng: true;
          };
          orderBy: {
            createdAt: 'desc';
          };
        };
      };
      orderBy: [
        {
          status: 'asc';
        },
        {
          updatedAt: 'desc';
        },
      ];
    } = {
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
            locationLat: true,
            locationLng: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    };

    if (status && allowedUnitStatuses.has(status as UnitStatus)) {
      query.where = {
        status: status as UnitStatus,
      };
    }

    const ambulances = await prisma.driver.findMany(query);

    const units = ambulances.map((ambulance) => {
      const activeAssignmentCount = ambulance.assignedCases.length;

      return {
        ...ambulance,
        activeAssignmentCount,
        recommendedAction: getRecommendedAction(ambulance.status, activeAssignmentCount),
        currentAssignment: ambulance.assignedCases[0] ?? null,
      };
    });

    return NextResponse.json({ success: true, data: units }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching ambulance units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ambulance units', details: message },
      { status: 500 }
    );
  }
}
