import { getAllUsers, getUserById, getUserByUsername, getUserByEmail } from '../services/user.services.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables')
}


export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers().select('-password')
        if (!users) {
            return res.status(404).json({ success: false, message: 'No users found' })
        }
        res.status(200).json({ success: true, users })
    } catch (error) {
        console.error('Error in getUsers:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getUserWithId = async (req, res) => {
    try {
        const { id } = req.params
        const user = await getUserById(id).select('-passwrord')
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found' })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.error('Error in getUserWithId:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getUserWithUsername = async (req, res) => {
    try {
        const { username } = req.params
        const user = await getUserByUsername(username).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.error('Error in getUserWithUsername:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getUserWithEmail = async (req, res) => {
    try {
        const { email } = req.params
        const user = await getUserByEmail(email).select('-password')
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.error('Error in getUserWithEmail:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}