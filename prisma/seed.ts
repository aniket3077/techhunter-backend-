import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Users
  const user1 = await prisma.user.upsert({
    where: { phone: '+1234567890' },
    update: {},
    create: {
      name: 'John Doe',
      phone: '+1234567890',
      bloodType: 'O+',
      medicalHistory: 'No known allergies',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: '+1987654321' },
    update: {},
    create: {
      name: 'Jane Smith',
      phone: '+1987654321',
      bloodType: 'A-',
      medicalHistory: 'Penicillin allergy',
    },
  });

  console.log('✅ Created users');

  // Create Hospitals
  const hospital1 = await prisma.hospital.upsert({
    where: { id: 'hospital-1' },
    update: {},
    create: {
      id: 'hospital-1',
      name: 'City General Hospital',
      locationLat: 40.7128,
      locationLng: -74.0060,
      availableBeds: 15,
    },
  });

  const hospital2 = await prisma.hospital.upsert({
    where: { id: 'hospital-2' },
    update: {},
    create: {
      id: 'hospital-2',
      name: 'Mercy Medical Center',
      locationLat: 40.7589,
      locationLng: -73.9851,
      availableBeds: 8,
    },
  });

  console.log('✅ Created hospitals');

  // Create Drivers
  const driver1 = await prisma.driver.upsert({
    where: { id: 'driver-1' },
    update: {},
    create: {
      id: 'driver-1',
      driverName: 'Mike Johnson',
      status: 'AVAILABLE',
      currentLat: 40.7128,
      currentLng: -74.0060,
      hospitalId: hospital1.id,
    },
  });

  const driver2 = await prisma.driver.upsert({
    where: { id: 'driver-2' },
    update: {},
    create: {
      id: 'driver-2',
      driverName: 'Sarah Williams',
      status: 'AVAILABLE',
      currentLat: 40.7589,
      currentLng: -73.9851,
      hospitalId: hospital2.id,
    },
  });

  console.log('✅ Created drivers');

  // Create Police Units
  const police1 = await prisma.policeUnit.upsert({
    where: { id: 'police-1' },
    update: {},
    create: {
      id: 'police-1',
      officerName: 'Officer Brown',
      precinct: 'Precinct 1',
      status: 'AVAILABLE',
      currentLat: 40.7128,
      currentLng: -74.0060,
    },
  });

  const police2 = await prisma.policeUnit.upsert({
    where: { id: 'police-2' },
    update: {},
    create: {
      id: 'police-2',
      officerName: 'Officer Davis',
      precinct: 'Precinct 2',
      status: 'AVAILABLE',
      currentLat: 40.7589,
      currentLng: -73.9851,
    },
  });

  console.log('✅ Created police units');

  // Create Emergency Cases
  const case1 = await prisma.emergencyCase.create({
    data: {
      userId: user1.id,
      status: 'PENDING',
      locationLat: 40.7130,
      locationLng: -74.0065,
      aiSeverity: 'HIGH',
      aiDescription: 'Possible vehicle collision detected',
      imageUrls: ['https://example.com/accident1.jpg'],
    },
  });

  const case2 = await prisma.emergencyCase.create({
    data: {
      userId: user2.id,
      status: 'DISPATCHED',
      locationLat: 40.7590,
      locationLng: -73.9855,
      aiSeverity: 'CRITICAL',
      aiDescription: 'Multiple vehicle collision with injuries',
      imageUrls: ['https://example.com/accident2.jpg'],
      assignedDriverId: driver1.id,
      assignedPoliceId: police1.id,
    },
  });

  console.log('✅ Created emergency cases');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
