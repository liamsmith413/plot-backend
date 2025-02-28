import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { google } from 'googleapis';
import Auth from '../models/Auth';
import { logger } from '../config/logger';
import { config } from 'dotenv-safe';

import { IAuth } from '../models/Auth';

config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

export const googleAuth = (req: Request, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile'],
    });
    res.redirect(url);
};

export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
    const { code, error, error_description } = req.query;
    const ip = req.ip || req.headers['x-forwarded-for'] || ''; // User IP
    const userAgent = req.headers['user-agent'] || ''; // User-Agent

    if (error) {
        logger.warn(`Google OAuth error: ${error}, Description: ${error_description}. IP: ${ip}, User-Agent: ${userAgent}`);
        return res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
    }

    if (!code) {
        logger.warn(`No code provided. IP: ${ip}, User-Agent: ${userAgent}`);
        res.status(400).json({ error: 'No code provided' });;
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        const user = await Auth.findOne({ email: userInfo.data.email });
        if (!user) {
            logger.error(`No user found for email: ${userInfo.data.email}. IP: ${ip}, User-Agent: ${userAgent}`);
            res.status(404).json({ error: 'User not found' });;
            return;
        }

        if (!user.isAdmin) {
            logger.error(`Unauthorized login attempt: ${userInfo.data.email}. IP: ${ip}, User-Agent: ${userAgent}`);
            res.status(403).json({ error: 'Unauthorized' });;
            return;
        }

        const token = jwt.sign({ userInfo: userInfo.data }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return res.redirect(`${process.env.CLIENT_URL}/admin` || 'http://localhost:5173/admin');
    } catch (error) {
        logger.error(`Google callback error: ${(error as Error).message}. IP: ${ip}, User-Agent: ${userAgent}`);
        res.status(500).send('Authentication failed.');
        return;
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as jwt.JwtPayload & { userInfo: { email: string } };
        const user = await Auth.findOne({ email: decoded.userInfo.email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { autoApprove, notificationEmail, notificationEnabled, defaultAdminWallet } = user;

        res.json({ ...decoded, autoApprove, notificationEmail, notificationEnabled, defaultAdminWallet });
    } catch (error) {
        logger.error('JWT Verification Error', error);
        res.status(401).json({ message: 'Invalid token' });
    }
    return;
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logged out successfully' });
};


interface AuthRequest extends Request {
    user?: any; // Extending request object to include user from authMiddleware
}

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user?.userInfo?.email) {
            res.status(401).json({ message: "Unauthorized: No user found in request" });
            return;
        }

        const email = req.user.userInfo.email;
        const updateFields = ["defaultAdminWallet", "notificationEmail", "notificationEnabled", "autoApprove"];
        const updates: Partial<IAuth> = {};

        // Filter out only the provided fields
        updateFields.forEach((field) => {
            if (req.body[field] !== undefined) updates[field as keyof IAuth] = req.body[field];
        });

        if (Object.keys(updates).length === 0) {
            res.status(400).json({ message: "At least one field must be provided for an update" });
            return;
        }

        const updatedUser = await Auth.findOneAndUpdate({ email }, { $set: updates }, { new: true, runValidators: true });

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


