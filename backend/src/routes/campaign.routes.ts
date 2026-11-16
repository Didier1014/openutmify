import { Router } from 'express';
import {
  listCampaigns,
  getCampaign,
  updateCampaignStatus,
  updateCampaignBudget,
  listAdAccounts,
} from '../controllers/campaign.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/accounts', listAdAccounts);
router.get('/', listCampaigns);
router.get('/:id', getCampaign);
router.patch('/:id/status', updateCampaignStatus);
router.patch('/:id/budget', updateCampaignBudget);

export default router;
