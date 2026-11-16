import { Router } from 'express';
import { getDailyReport } from '../controllers/report.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/daily', getDailyReport);

export default router;
