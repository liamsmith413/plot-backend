import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Auth document (Admin User)
export interface IAuth extends Document {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    isAdmin: boolean;  // New field to distinguish admin users
    defaultAdminWallet: string;
    notificationEmail: string;
    notificationEnabled: boolean;
    autoApprove: boolean;
}

// Define the auth schema
const authSchema: Schema<IAuth> = new Schema(
    {
        id: { type: String, unique: true },
        email: { type: String, required: true, unique: true },
        verified_email: { type: Boolean, },
        name: { type: String, },
        given_name: { type: String, },
        family_name: { type: String, },
        picture: { type: String },
        isAdmin: { type: Boolean, default: false },  // Default is false, but can be set to true for admin
        defaultAdminWallet: { type: String },
        notificationEmail: { type: String },
        notificationEnabled: { type: Boolean, default: false },
        autoApprove: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// Create the auth model
const Auth = mongoose.model<IAuth>('Auth', authSchema);

export default Auth;
