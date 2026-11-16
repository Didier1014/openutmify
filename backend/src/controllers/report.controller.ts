import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getDailyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { period = '7d', account, product } = req.query;

    const sales = await prisma.sale.findMany({
      where: { userId },
    });

    const byDay: Record<string, { vendas: number; cpa: number; gastos: number; despesas: number; faturamento: number; lucro: number; roas: number }> = {};

    sales.forEach((s) => {
      const day = s.createdAt.toISOString().split('T')[0];
      if (!byDay[day]) byDay[day] = { vendas: 0, cpa: 0, gastos: 0, despesas: 0, faturamento: 0, lucro: 0, roas: 0 };
      byDay[day].vendas += 1;
      byDay[day].gastos += Number(s.cost);
      byDay[day].faturamento += Number(s.revenue);
      byDay[day].lucro += Number(s.profit);
    });

    Object.keys(byDay).forEach((day) => {
      const d = byDay[day];
      d.cpa = d.gastos / (d.vendas || 1);
      d.roas = d.gastos > 0 ? Number((d.faturamento / d.gastos).toFixed(2)) : 0;
    });

    res.json({
      period,
      dias: Object.entries(byDay).map(([day, v]) => ({ data: day, ...v })),
      totalVendas: sales.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
