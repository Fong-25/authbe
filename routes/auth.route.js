import express from 'express'
import {
    signup,
    login,
    logout,
    changePassword,
    requestPasswordReset,
    resetPasswordwithToken
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';


const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.post('/change-password', authMiddleware, changePassword)
router.post('/request-pasword-reset', requestPasswordReset)
router.post('/reset-password', resetPasswordwithToken)

export default router
