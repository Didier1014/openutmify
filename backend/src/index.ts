import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { prisma } from './utils/prisma';

import authRoutes from './routes/auth.routes';
import campaignRoutes from './routes/campaign.routes';
import dashboardRoutes from './routes/dashboard.routes';
import eventRoutes from './routes/event.routes';
import utmRoutes from './routes/utm.routes';
import reportRoutes from './routes/report.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unavailable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/utms', utmRoutes);
app.use('/api/reports', reportRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 UTMify Backend rodando na porta ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});

export default app;
