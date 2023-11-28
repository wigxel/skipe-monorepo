import { Router } from 'express';
import { use } from '../utils/errors';
import { AnalyticsProductAndUser } from '../modules/analytics/analytics.controller';

const router = Router();

router.get('/', use(AnalyticsProductAndUser));

export default router;
