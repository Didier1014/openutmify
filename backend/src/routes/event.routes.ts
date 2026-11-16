import { Router } from 'express';
import { trackEvent, listEvents, getFunnel } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/track', trackEvent);
router.use(authenticate);
router.get('/', listEvents);
router.get('/funnel', getFunnel);

export default router;
