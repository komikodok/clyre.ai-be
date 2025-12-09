import express from 'express';
import { errorMiddleware } from '../middlewares/error.middleware';
import routes from './routes';
import cors from 'cors'
import { logger } from '../utils/logging';

const PORT = Number(process.env.PORT) || 5000

const app = express();

app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use('/api', routes)
app.use(errorMiddleware)

app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`))

export default app
