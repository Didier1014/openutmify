import { Router } from 'express';
import { getUtmReport } from '../controllers/utm.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/report', getUtmReport);

export default router;
