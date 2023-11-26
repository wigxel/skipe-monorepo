import { Request, Response } from 'express';
import { respond } from '../../utils/respond';
import { AnalyticsService } from './analytics.service';

export const AnalyticsProductAndUser = async (req: Request, res: Response) => {
  const analytics = await AnalyticsService();
  return respond(analytics, res);
};
