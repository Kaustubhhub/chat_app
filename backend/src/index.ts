import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.routes'
import messagesRouter from './routes/messages.routes'

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/messages', messagesRouter)

app.listen(5000, () => {
    console.log('The server is running on port 5000')
})