import { Request, Response } from 'express';
import User from '../models/User';

// Controller to get user profile by wallet_id
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find user by wallet_id from request parameters
        const user = await User.findOne({ wallet_id: req.params.id });
        
        // If user not found, respond with 404 status
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        // Respond with user data
        res.status(200).json(user);
    } catch (error) {
        // Handle errors and respond with 500 status
        const errorMessage = (error as Error).message;
        res.status(500).json({ message: 'Error fetching user profile', error: errorMessage });
    }
};

// Controller to update user profile by wallet_id
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress, ...updateData } = req.body;

        // Find the user by wallet_id
        const existingUser = await User.findOne({ wallet_id: req.params.id });

        if (existingUser) {
            // If the user exists, update with the provided data
            const updatedUser = await User.findOneAndUpdate(
                { wallet_id: req.params.id },  // Find user by wallet_id
                updateData,                    // New data to update
                { new: true }                  // Return the updated user
            );
            res.status(200).json(updatedUser);
        } else {
            // If the user doesn't exist, create a new one
            const newUser = new User({
                wallet_id: req.params.id,     // Assuming wallet_id is passed in the URL
                ...updateData                 // The rest of the update data
            });

            const savedUser = await newUser.save();
            res.status(201).json(savedUser);  // Respond with the newly created user
        }
    } catch (error) {
        // Handle errors and respond with 500 status
        const errorMessage = (error as Error).message || 'Unknown error';
        res.status(500).json({ message: 'Error updating user profile', error: errorMessage });
    }
};