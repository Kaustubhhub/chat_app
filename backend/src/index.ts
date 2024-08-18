import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import messagesRouter from './routes/messages.routes'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket'
import path from 'path'

const __dirname = path.resolve();

// const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/messages', messagesRouter)

if (process.env.NODE_ENV !== 'development') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(5000, () => {
    console.log('The server is running on port 5000')
})