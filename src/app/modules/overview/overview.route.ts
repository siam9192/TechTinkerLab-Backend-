import { Router } from 'express';
import { OverviewController } from './overview.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/admin', auth('ADMIN'), OverviewController.getAdminOverview);

router.get(
  '/current-user',
  auth('USER'),
  OverviewController.getCurrentUserOverview,
);

router.get(
  '/post/:postId',
  auth('USER'),
  OverviewController.getPostOverviewData,
);
export const OverviewRouter = router;
