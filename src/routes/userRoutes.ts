import express from 'express';
import { register, login, logout, profile } from '../controllers/userController';
import auth from '../middleware/auth';
import { RequestHandler } from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth as RequestHandler, logout);
router.get('/profile', auth as RequestHandler, profile);

export default router;
