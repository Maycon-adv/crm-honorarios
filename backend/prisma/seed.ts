import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@crm.com' },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@crm.com',
      password: hashedPassword,
      role: 'Admin',
    },
  });

  console.log('✅ Admin user created:', admin.email);
  console.log('📧 Email: admin@crm.com');
  console.log('🔑 Senha: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
