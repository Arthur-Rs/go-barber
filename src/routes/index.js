import { Router } from 'express';
import Multer from 'multer';
import MulterSettings from '../settings/multer';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';
import FileController from '../app/controllers/FileController';
import ProviderController from '../app/controllers/ProviderController';

import authMiddleware from '../app/middlewares/authMiddleware';
import existingMiddleware from '../app/middlewares/existingMiddleware';

const router = Router();
const upload = Multer(MulterSettings);

router.post('/user', existingMiddleware, UserController.store);
router.post('/session', SessionController.store);

// =========== Logged Routes ============= \\

router.use(authMiddleware);

router.get('/provider', ProviderController.index);

router.post('/file', upload.single('avatar'), FileController.store);

router.put('/user', existingMiddleware, UserController.update);

export default router;
