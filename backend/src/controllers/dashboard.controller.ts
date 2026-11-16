import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { dateOption = 'today', platform, trafficSource, adAccount, products, saleType } = req.query;

    const sales = await prisma.sale.findMany({
      where: { userId },
    });

    const totalRevenue = sales.reduce((acc, s) => acc + Number(s.revenue), 0);
    const totalCost = sales.reduce((acc, s) => acc + Number(s.cost), 0);
    const totalProfit = totalRevenue - totalCost;
    const totalSales = sales.length;
    const roas = totalCost > 0 ? totalRevenue / totalCost : 0;

    const byPayment: Record<string, { count: number; revenue: number }> = {};
    sales.forEach((s) => {
      const key = s.paymentMethod || 'OUTROS';
      if (!byPayment[key]) byPayment[key] = { count: 0, revenue: 0 };
      byPayment[key].count += 1;
      byPayment[key].revenue += Number(s.revenue);
    });

    res.json({
      faturamentoLiquido: totalRevenue,
      lucro: totalProfit,
      roas: Number(roas.toFixed(2)),
      custoAnuncios: totalCost,
      totalVendas: totalSales,
      arpu: totalSales > 0 ? Number((totalRevenue / totalSales).toFixed(2)) : 0,
      vendasPorPagamento: byPayment,
      atualizadoEm: new Date().toISOString(),
      filtros: { dateOption, platform, trafficSource, adAccount, products, saleType },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfitByHour = async (_req: Request, res: Response): Promise<void> => {
  try {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data = hours.map((h) => ({
      hora: `${h.toString().padStart(2, '0')}:00`,
      lucro: Math.round(Math.random() * 1000) / 100,
      faturamento: Math.round(Math.random() * 2000) / 100,
      investimento: Math.round(Math.random() * 800) / 100,
    }));
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
