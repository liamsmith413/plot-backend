import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import plotRoutes from './routes/plotRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/plots', plotRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the API" });
})

export default app;