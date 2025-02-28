import express from 'express';
import {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from '../controllers/transactionController';

const router = express.Router();

// Routes for managing transactions
router.post('/', createTransaction); // Create a new transaction
router.get('/', getTransactions); // Get all transactions
router.get('/:id', getTransactionById); // Get a single transaction by ID
router.put('/:id', updateTransaction); // Update an existing transaction
router.delete('/:id', deleteTransaction); // Delete a transaction by ID

export default router;
