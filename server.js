import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import cors from 'cors'
import authRoutes from './routes/auth.route.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: '*',
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("First Cursor API")
})

app.use('/api/auth', authRoutes) // auth routes

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(MONGO_URI)
});