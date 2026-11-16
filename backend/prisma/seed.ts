import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Didier!semana1973!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'matuevampiro123@gmail.com' },
    update: {},
    create: {
      email: 'matuevampiro123@gmail.com',
      passwordHash,
      name: 'Semana Ferdinand',
      role: 'USER',
    },
  });

  const metaAccount = await prisma.adAccount.create({
    data: {
      userId: user.id,
      platform: 'META',
      accountId: 'act_123456789',
      accountName: 'Moz Money - Meta Ads',
      accessToken: 'encrypted-token-meta',
      isConnected: true,
    },
  });

  const googleAccount = await prisma.adAccount.create({
    data: {
      userId: user.id,
      platform: 'GOOGLE',
      accountId: '123-456-7890',
      accountName: 'Moz Money - Google Ads',
      accessToken: 'encrypted-token-google',
      isConnected: true,
    },
  });

  const kwaiAccount = await prisma.adAccount.create({
    data: {
      userId: user.id,
      platform: 'KWAI',
      accountId: 'kwai_987654',
      accountName: 'Moz Money - Kwai',
      accessToken: 'encrypted-token-kwai',
      isConnected: false,
    },
  });

  const campaigns = [
    { adAccountId: metaAccount.id, name: 'MOZ MONEY 5.0', status: 'ACTIVE', budget: 52.00, platform: 'META', externalId: 'meta_camp_001' },
    { adAccountId: metaAccount.id, name: 'Pree MOZ MONEY 3.2', status: 'ACTIVE', budget: 32.00, platform: 'META', externalId: 'meta_camp_002' },
    { adAccountId: googleAccount.id, name: 'Search MOZ MONEY', status: 'PAUSED', budget: 100.00, platform: 'GOOGLE', externalId: 'google_camp_001' },
  ];

  for (const c of campaigns) {
    await prisma.campaign.create({ data: c });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    await prisma.sale.create({
      data: {
        userId: user.id,
        product: 'Moz Money - Ganhe dinheiro extra',
        paymentMethod: i % 2 === 0 ? 'PIX' : 'CARTAO',
        saleType: 'APROVADA',
        amount: 99.90,
        revenue: 99.90,
        cost: 30.00,
        profit: 69.90,
        roas: 3.33,
        utmSource: 'facebook',
        utmMedium: 'cpc',
        utmCampaign: 'MOZ MONEY 5.0',
        clickId: 'fb_' + i,
        createdAt: date,
      },
    });
  }

  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: 'SCALE',
      status: 'ACTIVE',
      salesLimit: 120000,
      price: 549.90,
      currency: 'BRL',
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.notificationSetting.create({
    data: {
      userId: user.id,
      type: 'SALE_APPROVED',
      enabled: true,
      value: 'TOTAL',
      profitStatus: 'DETALHADO',
    },
  });

  await prisma.notificationSetting.create({
    data: {
      userId: user.id,
      type: 'REPORT',
      enabled: true,
      time: '08:00',
      profitStatus: 'RESUMO',
    },
  });

  console.log('Seed concluído com sucesso!');
  console.log(`Usuário: ${user.email}`);
  console.log(`Senha: Didier!semana1973!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
