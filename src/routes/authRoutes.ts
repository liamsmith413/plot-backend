
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';

const router = Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLEINT_SECRET,
    'http://localhost:5000/auth/google/callback'
)

export default router;
