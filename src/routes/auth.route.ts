import { Router } from 'express';
import { use } from '../utils/errors';
import { LoginUser, RegisterUser } from '../modules/auth/controllers/auth.controller';

const router = Router();

router.post('/register', use(RegisterUser));
router.post('/login', use(LoginUser));

export default router;
