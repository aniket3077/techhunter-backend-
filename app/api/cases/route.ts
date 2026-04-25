import { NextResponse } from 'next/server';
import { prisma } from '../../../src/lib/prisma';

type CaseStatus = 'PENDING' | 'DISPATCHED' | 'RESOLVED';

const allowedCaseStatuses = new Set<CaseStatus>(['PENDING', 'DISPATCHED', 'RESOLVED']);

// GET /api/cases
// Fetch active emergency cases. Can filter by status if provided in query params.
export const dynamic = 'force-dynamic'; // Prevent static caching for this route

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const assignedDriverId = searchParams.get('assignedDriverId');
    const aiSeverity = searchParams.get('aiSeverity');

    const query: {
      include: {
        user: {
          select: {
            name: true;
            phone: true;
            bloodType: true;
            medicalHistory: true;
          };
        };
        assignedDriver: {
          include: {
            hospital: {
              select: {
                name: true;
              };
            };
          };
        };
        assignedPolice: true;
      };
      orderBy: {
        createdAt: 'desc';
      };
      where?: {
        status?: CaseStatus;
        userId?: string;
        assignedDriverId?: string;
        aiSeverity?: string;
      };
    } = {
      include: {
        user: {
          select: { name: true, phone: true, bloodType: true, medicalHistory: true },
        },
        assignedDriver: {
          include: {
            hospital: {
              select: {
                name: true,
              },
            },
          },
        },
        assignedPolice: true,
      },
      orderBy: { createdAt: 'desc' },
    };

    const where: {
      status?: CaseStatus;
      userId?: string;
      assignedDriverId?: string;
      aiSeverity?: string;
    } = {};

    if (status && allowedCaseStatuses.has(status as CaseStatus)) {
      where.status = status as CaseStatus;
    }

    if (userId) {
      where.userId = userId;
    }

    if (assignedDriverId) {
      where.assignedDriverId = assignedDriverId;
    }

    if (aiSeverity) {
      where.aiSeverity = aiSeverity.toUpperCase();
    }

    if (Object.keys(where).length > 0) {
      query.where = where;
    }

    const cases = await prisma.emergencyCase.findMany(query);

    return NextResponse.json({ success: true, data: cases }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching cases:', error);
    return NextResponse.json({ error: 'Failed to fetch cases', details: message }, { status: 500 });
  }
}
