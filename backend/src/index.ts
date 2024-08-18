import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import messagesRouter from './routes/messages.routes'
import cookieParser from 'cookie-parser'
import { app, server } from './socket/socket'

// const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/messages', messagesRouter)

server.listen(5000, () => {
    console.log('The server is running on port 5000')
})