import Auth from "../models/Auth";

/**
 * This function is responsible for creating the first admin user in the system.
 * It is typically called when initializing the application for the first time
 * to ensure that there's at least one user with administrative privileges.
 */

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