import jwt from 'jsonwebtoken'
import { getAllUsers, getUserById, getUserByUsername, createUser } from '../services/user.services.js';


import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
}

export const adminMiddleware = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const user = await getUserById(decoded.userId).select('-password')
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        req.user = user;

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden' })
        }
        next();
    } catch (error) {
        console.error('Error in adminMiddleware:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}