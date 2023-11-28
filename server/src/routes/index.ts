import { Express, Request, Response, NextFunction } from 'express';
import { appError } from '../utils/errors';
import productRequestRoute from './product-request.route';
import analyticsRoute from './analytics.route';
import authRoutes from './auth.route';

const routes = (app: Express) => {
  app.get('/api/v1', (req: Request, res: Response) => res.send({ status: 200, message: 'Welcome to Skipe' }));
  app.use('/api/v1', authRoutes);
  app.use('/api/v1/product-requests', productRequestRoute);
  app.use('/api/v1/analytics', analyticsRoute);

  app.all('*', (req: Request, res: Response) =>
    res.status(404).send({
      status: 404,
      message: "Oops the url has been moved or doesn't exist",
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    const applicationError = appError(error);
    response.status(error.status || 500).json({
      status: error.status || 500,
      title: 'Server error',
      message: applicationError.message,
    });
  });
};

export default routes;
