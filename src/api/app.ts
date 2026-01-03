import express from 'express';
import { errorMiddleware } from '../middlewares/error.middleware';
import routes from './routes';
import cors from 'cors'


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

export default app
