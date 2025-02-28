import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import { google, oauth2_v2 } from 'googleapis';
import { config } from 'dotenv-safe';
import Auth from '../models/Auth';
import { logger } from '../config/logger';

config();

const router = Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

router.get('/google', (req: Request, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile'],
    });
    res.redirect(url);
});

router.get('/google/callback', async (req: Request, res: Response): Promise<void> => {
    const { code, error, error_description } = req.query;
    const ip = req.ip || req.headers['x-forwarded-for'] || ''; // Get user IP address
    const userAgent = req.headers['user-agent'] || ''; // Get user agent (browser/device info)

    // Handle the case where the user clicked "Cancel" or an error occurred
    if (error) {
        logger.warn(`Google OAuth canceled or error occurred. Error: ${error}, Description: ${error_description}. IP: ${ip}, User-Agent: ${userAgent}`);
        return res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    }

    // Early return for missing code
    if (!code) {
        logger.warn(`No code provided in the callback request. IP: ${ip}, User-Agent: ${userAgent}`);
        res.status(400).json({ error: 'No code provided' });
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        // Find user and check admin status
        const user = await Auth.findOne({ email: userInfo.data.email });

        if (!user) {
            logger.error(`No user found for email: ${userInfo.data.email}. IP: ${ip}, User-Agent: ${userAgent}`);
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { isAdmin } = user;

        // Handle unauthorized login attempt
        if (!isAdmin) {
            logger.error(`Unauthorized login attempt by user with email: ${userInfo.data.email}. IP: ${ip}, User-Agent: ${userAgent}`);
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        // Create JWT token
        const token = jwt.sign({ userInfo: userInfo.data }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        // Send token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        // Redirect to frontend
        return res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    } catch (error) {
        const errorMessage = (error as Error).message;
        logger.error(`Error during Google callback: ${errorMessage}. IP: ${ip}, User-Agent: ${userAgent}`);
        res.status(500).send('Authentication failed.');
        return;
    }
});



router.get('/me', (req: Request, res: Response): void => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        res.json(decoded); // Send the decoded user data
    } catch (error) {
        console.error("JWT Verification Error", error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

router.get('/logout', (req, res) => {
    // Clear the JWT cookie (ensure options match when setting the cookie)
    res.clearCookie('token', {
        httpOnly: true,  // Ensure it's only accessible via HTTP requests (not JavaScript)
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'lax',  // Mitigate CSRF attacks
    });

    // Return a success response
    res.status(200).json({ message: 'Logged out successfully' });
});



export default router;