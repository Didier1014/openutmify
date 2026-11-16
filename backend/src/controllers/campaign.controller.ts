import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const listCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { platform, status, accountId } = req.query;

    const campaigns = await prisma.campaign.findMany({
      where: {
        adAccount: { userId },
        ...(platform ? { platform: String(platform) } : {}),
        ...(status ? { status: String(status) } : {}),
        ...(accountId ? { adAccountId: String(accountId) } : {}),
      },
      include: {
        adAccount: { select: { id: true, platform: true, accountName: true, isConnected: true } },
        _count: { select: { sales: true, metrics: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ campaigns });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        adAccount: true,
        adSets: { include: { ads: true } },
        sales: { orderBy: { createdAt: 'desc' }, take: 50 },
        metrics: { orderBy: { date: 'desc' }, take: 30 },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campanha não encontrada' });
      return;
    }

    res.json({ campaign });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCampaignStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: { status },
    });

    res.json({ campaign });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCampaignBudget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { budget } = req.body;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: { budget: parseFloat(budget) },
    });

    res.json({ campaign });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listAdAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const accounts = await prisma.adAccount.findMany({
      where: { userId },
      include: { _count: { select: { campaigns: true } } },
    });
    res.json({ accounts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
