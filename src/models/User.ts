
import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    user_id: string;
    wallet_id: string;
    tg_username?: string;
    email_id?: string;
}

const userSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    wallet_id: { type: String, required: true },
    tg_username: { type: String },
    email_id: { type: String },
});

export default mongoose.model<IUser>('User', userSchema);
