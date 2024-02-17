import { prisma } from "../config/database";

export default eventHandler(async () => {
  const [customers, vendors, requests_handled] = await Promise.all([
    prisma.users.count({
      where: { is_vendor: false },
    }),
    prisma.users.count({
      where: { is_vendor: true },
    }),
    prisma.product_requests.count(),
  ]);

  return {
    metrics: {
      customers,
      vendors,
      requests_handled,
    },
  };
});
