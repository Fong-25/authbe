import {
    getAllUsers,
    validateEmail,
    getUserById,
    getUserByUsername,
    createUser,
    getUserByEmail,
    updateUser,
    verifyResetToken,
    generateResetToken,
    resetPassword,
    generateVerificationToken,
    verifyVerificationToken
} from '../services/user.services.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
}

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUsername = await getUserByUsername(username)
        const existingEmail = await getUserByEmail(email)

        if (existingUsername || existingEmail) {
            return res.status(400).json({ success: false, message: "Username or email already exists" })
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const resetToken = null
        const resetTokenExpiry = null
        const newUser = await createUser({
            username,
            email,
            password: hashedPassword,
            resetToken,
            resetTokenExpiry
        })
        if (!newUser) {
            return res.status(400).json({ success: false, message: "Internal server error" })
        }
        // temporary NOT generating jwt token in Sign up
        // const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' })
        const verificationToken = await generateVerificationToken(newUser._id)
        await updateUser(newUser._id, { verificationToken })
        res.status(201).json({ success: true, message: "User created sucessfully. Login to continue." })
    } catch (error) {
        console.error('Error in signup:', error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        // generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' })
        res.cookie('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,  // 1 day
        })
        res.status(200).json({ success: true, message: 'Login successfully' })
    } catch (error) {
        console.error('Error in login:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const logout = (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }
        res.clearCookie('token', {
            httpOnly: true,
            path: '/'
        })
        res.status(200).json({ success: true, message: 'Logout successfully' })
    } catch (error) {
        console.error('Error in logout:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current password and new password are required" });
        }
        const userId = req.user._id

        const user = await getUserById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" })
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await updateUser(userId, { password: hashedPassword })
        res.status(200).json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
        console.error('Error in changePassword:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await getUserByEmail(email)
        if (!user) {
            // return res.status(404).json({ success: false, message: "User not found" })
            // security reason: don't reveal if email is found or not
            return res.status(200).json({
                success: true,
                message: "If your email exists in our system, you will receive a password reset link shortly."
            });
        }

        const resetToken = await generateResetToken(user._id)

        // In production, dont return the token in response, send it via email
        res.status(200).json({
            success: true,
            message: 'If your email exists in our system, you will receive a password reset link shortly.',
            // In production, dont return the token in response, send it via email
            token: resetToken
        })
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const resetPasswordwithToken = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const user = await verifyResetToken(token)
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUser(user._id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        });
        res.status(200).json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.error('Error in resetPasswordWithToken:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" })
        }
        const user = await getUserById(req.user._id)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const isTokenValid = (token === user.verificationToken)
        if (!isTokenValid) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        await updateUser(user._id, {
            isVerified: true,
            verificationToken: null
        })
        res.status(200).json({ success: true, message: "Email verified successfully" })
    } catch (error) {
        console.error('Error in verifyEmail:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}