import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

type CaseStatus = 'PENDING' | 'DISPATCHED' | 'RESOLVED';

type UpdateCaseBody = {
  status?: CaseStatus;
  assignedDriverId?: string | null;
  assignedPoliceId?: string | null;
  aiSeverity?: string | null;
  aiDescription?: string | null;
};

const allowedCaseStatuses = new Set<CaseStatus>(['PENDING', 'DISPATCHED', 'RESOLVED']);

export async function PATCH(
  req: Request,
  context: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await context.params;
    const body = (await req.json()) as UpdateCaseBody;

    const data: {
      status?: CaseStatus;
      assignedDriverId?: string | null;
      assignedPoliceId?: string | null;
      aiSeverity?: string | null;
      aiDescription?: string | null;
    } = {};

    if (body.status && allowedCaseStatuses.has(body.status)) {
      data.status = body.status;
    }

    if ('assignedDriverId' in body) {
      data.assignedDriverId = body.assignedDriverId ?? null;
    }

    if ('assignedPoliceId' in body) {
      data.assignedPoliceId = body.assignedPoliceId ?? null;
    }

    if ('aiSeverity' in body) {
      data.aiSeverity = body.aiSeverity ? body.aiSeverity.toUpperCase() : null;
    }

    if ('aiDescription' in body) {
      data.aiDescription = body.aiDescription?.trim() || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update.' },
        { status: 400 }
      );
    }

    const emergencyCase = await prisma.emergencyCase.update({
      where: { id: caseId },
      data,
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
    });

    return NextResponse.json({ success: true, data: emergencyCase }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating emergency case:', error);
    return NextResponse.json(
      { error: 'Failed to update emergency case', details: message },
      { status: 500 }
    );
  }
}
