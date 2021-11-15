/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 *
 */
async function main() {
  const cdiMilestones: { count: number, bonusPercentage: number }[] = [
    { count: 600, bonusPercentage: 50 },
    { count: 900, bonusPercentage: 55 },
    { count: 1200, bonusPercentage: 60 },
    { count: 1500, bonusPercentage: 65 },
    { count: 1800, bonusPercentage: 70 },
    { count: 2100, bonusPercentage: 75 },
    { count: 2400, bonusPercentage: 80 },
    { count: 2700, bonusPercentage: 85 },
    { count: 3000, bonusPercentage: 90 },
  ];

  await prisma.position.upsert({
    where: { name: 'Propriétaire' },
    update: {},
    create: {
      name: 'Propriétaire',
      salaryPerQuarter: 35,
    },
  });

  await prisma.position.upsert({
    where: { name: 'Formateur' },
    update: {},
    create: {
      name: 'Formateur',
      salaryPerQuarter: 300,
      briefcaseMilestones: {
        create: [...cdiMilestones],
      },
    },
  });

  const chefEquipe = await prisma.position.upsert({
    where: { name: 'Chef d\'équipe' },
    update: {},
    create: {
      name: 'Chef d\'équipe',
      salaryPerQuarter: 250,
      briefcaseMilestones: {
        create: [...cdiMilestones],
      },
    },
  });

  await prisma.position.upsert({
    where: { name: 'CDI' },
    update: {},
    create: {
      name: 'CDI',
      salaryPerQuarter: 200,
      briefcaseMilestones: {
        create: [...cdiMilestones],
      },
    },
  });

  await prisma.position.upsert({
    where: { name: 'CDD' },
    update: {},
    create: {
      name: 'CDD',
      salaryPerQuarter: 180,
      briefcaseMilestones: {
        create: [
          { count: 600, bonusPercentage: 35 },
          { count: 900, bonusPercentage: 40 },
          { count: 1200, bonusPercentage: 45 },
          { count: 1500, bonusPercentage: 50 },
          { count: 1800, bonusPercentage: 55 },
          { count: 2100, bonusPercentage: 60 },
          { count: 2400, bonusPercentage: 65 },
          { count: 2700, bonusPercentage: 70 },
          { count: 3000, bonusPercentage: 75 },
        ],
      },
    },
  });

  await prisma.position.upsert({
    where: { name: 'Essai' },
    update: {},
    create: {
      name: 'Essai',
      salaryPerQuarter: 160,
      briefcaseMilestones: {
        create: [
          { count: 600, bonusPercentage: 20 },
          { count: 900, bonusPercentage: 25 },
          { count: 1200, bonusPercentage: 30 },
          { count: 1500, bonusPercentage: 35 },
          { count: 1800, bonusPercentage: 40 },
          { count: 2100, bonusPercentage: 45 },
          { count: 2400, bonusPercentage: 50 },
          { count: 2700, bonusPercentage: 55 },
          { count: 3000, bonusPercentage: 60 },
        ],
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'tonio.denaro@discord.gg' },
    update: {},
    create: {
      name: 'Tonio Denaro',
      email: 'tonio.denaro@discord.gg',
      password: '',
      phoneNumber: '555-4141',
      position: {
        connect: {
          id: chefEquipe.id,
        },
      },
      isDisabled: false,
      isAdmin: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
