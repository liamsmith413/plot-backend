
import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error fetching user profile', error: errorMessage });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error updating user profile', error: errorMessage });
    }
};
