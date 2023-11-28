import { returnResult } from '../../utils/respond';
import { GetUsersByRole } from '../accounts/repositories/user.repo';
import { GetProductRequestsQuery } from '../product-requests/repositories/product-request.repo';

export const AnalyticsService = async () => {
  const customers = await GetUsersByRole(false);
  const vendors = await GetUsersByRole(true);
  const productRequests = await GetProductRequestsQuery();

  return returnResult(true, {
    status: 200,
    title: 'Analytics',
    message: 'Analytics data',
    entity: {
      customers: customers.count,
      vendors: vendors.count,
      productRequests: productRequests.count,
    },
  });
};
