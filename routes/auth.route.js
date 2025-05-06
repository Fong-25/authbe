import express from 'express'
import { signup, login, logout } from '../controllers/auth.controller.js';
import { getUsers, getUserWithId } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/users', adminMiddleware, getUsers)
router.get('/user/:id', authMiddleware, getUserWithId)

export default router
