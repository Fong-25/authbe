import { getAllUsers, getUserById, getUserByUsername, createUser, getUserByEmail } from '../services/user.services.js';
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
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await createUser({
            username,
            email,
            password: hashedPassword
        })
        if (!newUser) {
            return res.status(400).json({ success: false, message: "Internal server error" })
        }
        // temporary NOT generating token in Sign up
        // const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' })

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

