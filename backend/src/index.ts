import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import messagesRouter from './routes/messages.routes';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/socket';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;

// Initialize middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);

// Serve frontend static files in production
if (process.env.NODE_ENV !== 'development') {
    app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

// Start the server
server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
