import { totp } from 'otplib';
import crypto from 'crypto';

const secret = process.env.OTP_SECRET || crypto.randomBytes(20).toString('hex');

export function generateOTP(userId: string): string {
    return totp.generate(secret + userId);
}

export function verifyOTP(userId: string, token: string): boolean {
    return totp.check(token, secret + userId);
}