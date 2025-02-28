import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Transaction from '../models/Transaction';

// Create a new transaction
export const createTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const { user_wallet, plot_id, amount, status = 'Pending' } = req.body;

        // Basic validation
        if (!user_wallet || !plot_id || !amount) {
            return res.status(400).json({ message: 'Missing required fields: user_wallet, plot_id, amount' });
        }

        // Validate wallet address format (example: Ethereum format)
        if (!/^0x[a-fA-F0-9]{40}$/.test(user_wallet)) {
            return res.status(400).json({ message: 'Invalid wallet address format' });
        }

        // Validate plot_id (MongoDB ObjectId format)
        if (!Types.ObjectId.isValid(plot_id)) {
            return res.status(400).json({ message: 'Invalid plot_id format' });
        }

        const newTransaction = new Transaction({
            user_wallet,
            plot_id,
            amount,
            status,
        });

        await newTransaction.save();
        return res.status(201).json(newTransaction);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: 'Error creating transaction', error: errorMessage });
    }
};

// Get all transactions
export const getTransactions = async (req: Request, res: Response): Promise<any> => {
    try {
        const transactions = await Transaction.find();
        return res.status(200).json(transactions);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: 'Error fetching transactions', error: errorMessage });
    }
};

// Get a transaction by ID
export const getTransactionById = async (req: Request, res: Response): Promise<any> => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(200).json(transaction);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: 'Error fetching transaction', error: errorMessage });
    }
};

// Update a transaction (e.g., marking it as completed, failed, etc.)
export const updateTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required for updating' });
        }

        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction status
        transaction.status = status;
        await transaction.save();

        return res.status(200).json(transaction);
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: 'Error updating transaction', error: errorMessage });
    }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.deleteOne();
        return res.status(204).send();  // No content, successfully deleted
    } catch (error) {
        const errorMessage = (error as Error).message;
        return res.status(500).json({ message: 'Error deleting transaction', error: errorMessage });
    }
};
