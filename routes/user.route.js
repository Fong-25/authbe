import express from 'express'
import { getUsers, getUserWithId,getUserWithUsername,getUserWithEmail } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = express.Router()

router.get('/users', adminMiddleware, getUsers)
router.get('/user/:id', authMiddleware, getUserWithId)
router.get('/user/username/:username', adminMiddleware, getUserWithUsername)
router.get('/user/email/:email', adminMiddleware, getUserWithEmail)


export default router