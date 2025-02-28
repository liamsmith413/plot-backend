import Auth from "../models/Auth";

export const createFirstAdmin = async () => {
    if (process.env.FIRST_ADMIN_EMAIL) {
        const adminExists = await Auth.findOne({ isAdmin: true });
        if (!adminExists) {
            const adminUser = new Auth({
                email: process.env.FIRST_ADMIN_EMAIL,
                isAdmin: true
            });
            await adminUser.save();
            console.log('First admin user created from environment variables');
        }
    }
};