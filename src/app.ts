import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import plotRoutes from './routes/plotRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { createFirstAdmin } from './config/createFirstAdmin';

const app = express();

// Middleware
app.use(express.json());
// Allow requests from your frontend and support credentials
app.use(
    cors({
        origin: process.env.CLIENT_URL,    // The exact origin of your frontend
        methods: "GET,POST,PUT,DELETE",     // Allowed HTTP methods
        allowedHeaders: "Content-Type,Authorization",  // Allowed headers
        credentials: true,                  // Allow credentials (cookies, authorization headers)
    })
);
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

// Create the first admin user
createFirstAdmin();

// Routes
app.use('/api/plots', plotRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;