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

const app = express();

// Middleware
app.use(express.json());
// Allow requests from your frontend (localhost:8080) and support credentials
app.use(
    cors({
        origin: "http://localhost:8080",    // The exact origin of your frontend
        methods: "GET,POST,PUT,DELETE",     // Allowed HTTP methods
        allowedHeaders: "Content-Type,Authorization",  // Allowed headers
        credentials: true,                  // Allow credentials (cookies, authorization headers)
    })
);
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/plots', plotRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

export default app;