import { Router } from 'express';
import { use } from '../utils/errors';
import { CreateProductRequest } from '../modules/product-requests/controllers/product-request.controller';
import { authorized } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', authorized, use(CreateProductRequest));

export default router;
