/* eslint-disable no-console */
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

/**
 *
 */
async function main() {
  await prisma.config.upsert({
    where: { isActive: true },
    update: {},
    create: {
      briefcaseEmployeePart: 15,
      contractEmployeePart: 80,
      isActive: true,
    },
  });

  const cdiMilestones: { count: number, bonusPercentage: number }[] = [
    { count: 0, bonusPercentage: 0 },
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
          { count: 0, bonusPercentage: 0 },
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
          { count: 0, bonusPercentage: 0 },
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

  await Promise.all([
    { name: 'Benny\'s', weeklyFee: 90000, insuredPercentage: 75 },
    { name: 'Black Cat', weeklyFee: 65000, insuredPercentage: 50 },
    { name: 'Marlowe Vineyard', weeklyFee: 90000, insuredPercentage: 75 },
    { name: 'La Ferme', weeklyFee: 90000, insuredPercentage: 75 },
    { name: 'SHMS - Lumber Yard', weeklyFee: 60000, insuredPercentage: 50 },
    { name: 'Ron Petroleum', weeklyFee: 65000, insuredPercentage: 50 },
    { name: 'Los Santos Taxi', weeklyFee: 55000, insuredPercentage: 25 },
    { name: 'Weazel News', weeklyFee: 65000, insuredPercentage: 50 },
    { name: 'Pißwasser', weeklyFee: 65000, insuredPercentage: 50 },
    { name: 'Humane Labs', weeklyFee: 70000, insuredPercentage: 50 },
    { name: 'Rogers Salvage & Scrap', weeklyFee: 90000, insuredPercentage: 75 },
    { name: 'Gouvernement (LSAS - EMS - LSPD - BCSO)', weeklyFee: 200000, insuredPercentage: 75 },
  ].map((company) => prisma.company.upsert({
    where: { name: company.name },
    update: {},
    create: {
      name: company.name,
      contracts:
      {
        create:
        [{
          weeklyFee: company.weeklyFee,
          insuredPercentage: company.insuredPercentage,
          isActive: true,
        }],
      },
    },
  })));

  await prisma.user.upsert({
    where: { email: 'tonio.denaro@discord.gg' },
    update: {},
    create: {
      name: 'Tonio Denaro',
      email: 'tonio.denaro@discord.gg',
      password: 'provisioning:tonio',
      phoneNumber: '555-4141',
      position: {
        connect: {
          id: chefEquipe.id,
        },
      },
      isDisabled: false,
      role: Role.ADMIN,
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
