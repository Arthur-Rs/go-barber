import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';

import authMiddleware from '../app/middlewares/authMiddleware';
import existingMiddleware from '../app/middlewares/existingMiddleware';

const router = Router();

router.post('/user', existingMiddleware, UserController.store);
router.post('/session', SessionController.store);

// =========== Logged Routes ============= \\

router.use(authMiddleware);

router.put('/user', existingMiddleware, UserController.update);

export default router;
