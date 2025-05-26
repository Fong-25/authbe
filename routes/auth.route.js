import express from 'express'
import {
    signup,
    login,
    logout,
    changePassword,
    requestPasswordReset,
    resetPasswordwithToken,
    verifyEmail
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import {
    limiter,
    resetPasswordRateLimit
} from '../middlewares/ratelimit.middleware.js'


const router = express.Router()

router.post('/signup', limiter, signup)
router.post('/login', limiter, login)
router.post('/logout', limiter, logout)

router.post('/change-password', authMiddleware, changePassword)
router.post('/request-password-reset', resetPasswordRateLimit, requestPasswordReset)
router.post('/reset-password', limiter, resetPasswordwithToken)
router.post('/verify-email', limiter, authMiddleware, verifyEmail)

export default router
