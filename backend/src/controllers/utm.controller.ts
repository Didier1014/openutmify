import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getUtmReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { groupBy = 'utm_campaign', product, account } = req.query;

    const sales = await prisma.sale.findMany({
      where: { userId },
    });

    const grouped: Record<string, { vendas: number; cpa: number; gastos: number; faturamento: number; lucro: number }> = {};

    sales.forEach((s) => {
      const key = s[groupBy as keyof typeof s] as string || 'Não definido';
      if (!grouped[key]) grouped[key] = { vendas: 0, cpa: 0, gastos: 0, faturamento: 0, lucro: 0 };
      grouped[key].vendas += 1;
      grouped[key].gastos += Number(s.cost);
      grouped[key].faturamento += Number(s.revenue);
      grouped[key].lucro += Number(s.profit);
    });

    Object.keys(grouped).forEach((key) => {
      const g = grouped[key];
      g.cpa = g.gastos / (g.vendas || 1);
    });

    res.json({
      resultados: Object.entries(grouped).map(([key, value]) => ({ [groupBy as string]: key, ...value })),
      total: sales.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
