
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    wallet_id: string;
    telegramUsername?: string;
    email?: string;
}

const userSchema: Schema = new Schema({
    wallet_id: { type: String, required: true, unique: true },
    telegramUsername: { type: String },
    email: { type: String },
});

export default mongoose.model<IUser>('User', userSchema);