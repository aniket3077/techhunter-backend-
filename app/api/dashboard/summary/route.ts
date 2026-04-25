import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export const dynamic = 'force-dynamic';

function getAverageResolutionMinutes(
  resolvedCases: Array<{ createdAt: Date; updatedAt: Date }>
) {
  if (resolvedCases.length === 0) {
    return null;
  }

  const totalDurationMs = resolvedCases.reduce((sum, emergencyCase) => {
    return sum + (emergencyCase.updatedAt.getTime() - emergencyCase.createdAt.getTime());
  }, 0);

  return Math.round(totalDurationMs / resolvedCases.length / 60000);
}

export async function GET() {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      activeEmergencies,
      pendingDispatch,
      criticalAlerts,
      resolvedToday,
      availableAmbulances,
      totalAmbulances,
      connectedHospitals,
      recentResolvedCases,
    ] = await Promise.all([
      prisma.emergencyCase.count({
        where: {
          status: {
            not: 'RESOLVED',
          },
        },
      }),
      prisma.emergencyCase.count({
        where: {
          status: 'PENDING',
        },
      }),
      prisma.emergencyCase.count({
        where: {
          status: {
            not: 'RESOLVED',
          },
          aiSeverity: {
            in: ['HIGH', 'CRITICAL'],
          },
        },
      }),
      prisma.emergencyCase.count({
        where: {
          status: 'RESOLVED',
          updatedAt: {
            gte: startOfDay,
          },
        },
      }),
      prisma.driver.count({
        where: {
          status: 'AVAILABLE',
        },
      }),
      prisma.driver.count(),
      prisma.hospital.count(),
      prisma.emergencyCase.findMany({
        where: {
          status: 'RESOLVED',
        },
        select: {
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 25,
      }),
    ]);

    const fleetReadiness =
      totalAmbulances === 0 ? null : Math.round((availableAmbulances / totalAmbulances) * 100);

    return NextResponse.json(
      {
        success: true,
        data: {
          activeEmergencies,
          pendingDispatch,
          criticalAlerts,
          resolvedToday,
          availableAmbulances,
          totalAmbulances,
          connectedHospitals,
          averageResolutionMinutes: getAverageResolutionMinutes(recentResolvedCases),
          fleetReadiness,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error building dashboard summary:', error);
    return NextResponse.json(
      { error: 'Failed to build dashboard summary', details: message },
      { status: 500 }
    );
  }
}
