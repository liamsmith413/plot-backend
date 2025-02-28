
import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    txn_id: string;
    user_wallet: string;
    plot_id: string;
    amount: number;
    status: string;
}

const transactionSchema: Schema = new Schema({
    txn_id: { type: String, required: true },
    user_wallet: { type: String, required: true },
    plot_id: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
