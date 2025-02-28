import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any; // Extend Request object to include user data
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return Promise.resolve();
        }

        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // Attach decoded user info to request

        next(); // Proceed to the next middleware or route handler
        return Promise.resolve();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        return Promise.resolve();
    }
};

export default authMiddleware;
