import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import { google, oauth2_v2 } from 'googleapis';
import { config } from 'dotenv-safe';

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
    const { code } = req.query;

    if (!code) {
        res.status(400).json({ error: 'No code provided' });
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        const oauth2: oauth2_v2.Oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client }); // Explicit type
        const userInfo = await oauth2.userinfo.get();

        const token = jwt.sign({ userInfo: userInfo.data }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        // Send token in cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'lax', // Mitigate CSRF attacks
        });

        // Redirect to frontend (important!)
        res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    } catch (error) {
        console.error('Error during Google callback:', error);
        res.status(500).send('Authentication failed.');
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
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
});


export default router;