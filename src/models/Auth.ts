import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Auth document (Admin User)
interface IAuth extends Document {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    isAdmin: boolean;  // New field to distinguish admin users
    password: string;  // Admin user password for authentication
}

// Define the auth schema
const authSchema: Schema<IAuth> = new Schema(
    {
        id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        verified_email: { type: Boolean, required: true },
        name: { type: String, required: true },
        given_name: { type: String, required: true },
        family_name: { type: String, required: true },
        picture: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },  // Default is false, but can be set to true for admin
        password: { type: String, required: true },  // Required for admin authentication
    },
    { timestamps: true }
);

// Create the auth model
const Auth = mongoose.model<IAuth>('Auth', authSchema);

export default Auth;
