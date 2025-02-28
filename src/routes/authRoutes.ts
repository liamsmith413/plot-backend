import { Router } from 'express';
import { googleAuth, googleAuthCallback, getUserProfile, logout, updateProfile } from '../controllers/authController';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/me', getUserProfile);
router.get('/logout', logout);
router.get('/update-profile', updateProfile);

export default router;
