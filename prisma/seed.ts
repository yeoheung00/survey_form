// prisma/seed.ts

import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('✨ Start seeding...');

  const initialId = 'admin';
  const initialPassword = 'password1234'; 

  const hashedPassword = await bcrypt.hash(initialPassword, 10);

    const admin = await prisma.admin.create({
      data: {
        id: initialId,
        pw: hashedPassword,
      },
    });
    console.log(`✅ Created admin user: ${admin.id}`);
  
  console.log('🎉 Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })