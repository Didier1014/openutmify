import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventName, platform, pixelId, eventId, data, source = 'CLIENT', clickId } = req.body;

    if (!userId || !eventName || !platform || !pixelId || !eventId) {
      res.status(400).json({ error: 'Campos obrigatórios: userId, eventName, platform, pixelId, eventId' });
      return;
    }

    const existing = await prisma.pixelEvent.findUnique({ where: { eventId } });
    if (existing) {
      res.status(200).json({ status: 'duplicate', eventId });
      return;
    }

    const event = await prisma.pixelEvent.create({
      data: {
        userId,
        eventName,
        platform,
        pixelId,
        eventId,
        data: data || {},
        source,
        clickId,
        status: 'RECEIVED',
      },
    });

    res.status(201).json({ status: 'received', eventId: event.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { platform, eventName, pixel, limit = '50' } = req.query;

    const events = await prisma.pixelEvent.findMany({
      where: {
        userId,
        ...(platform ? { platform: String(platform) } : {}),
        ...(eventName ? { eventName: String(eventName) } : {}),
        ...(pixel ? { pixelId: String(pixel) } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string, 10),
    });

    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getFunnel = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const funnel = await prisma.pixelEvent.groupBy({
      by: ['eventName'],
      where: { userId },
      _count: { eventName: true },
    });

    const totalSent = await prisma.pixelEvent.count({
      where: { userId, status: 'SENT' },
    });

    const totalReceived = await prisma.pixelEvent.count({
      where: { userId, status: 'RECEIVED' },
    });

    res.json({
      funil: funnel.map((f: { eventName: string; _count: { eventName: number } }) => ({
        evento: f.eventName,
        quantidade: f._count.eventName,
      })),
      totalRecebidos: totalReceived,
      totalEnviados: totalSent,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
