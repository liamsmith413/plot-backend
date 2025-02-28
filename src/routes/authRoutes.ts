import { Router } from 'express';
import { googleAuth, googleAuthCallback, getUserProfile, logout, updateProfile } from '../controllers/authController';
import authMiddleware from '../middlewares/auth';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/me', getUserProfile);
router.get('/logout', logout);
router.put('/update-profile', authMiddleware, updateProfile);

export default router;
