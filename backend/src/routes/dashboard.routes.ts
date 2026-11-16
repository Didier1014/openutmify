import { Router } from 'express';
import { getSummary, getProfitByHour } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', getSummary);
router.get('/profit-by-hour', getProfitByHour);

export default router;
