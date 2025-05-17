import User from '../models/user.model.js';
import crypto from 'crypto';

export const getAllUsers = () => User.find()
export const getUserById = (id) => User.findById(id)
export const getUserByEmail = (email) => User.findOne({ email })
export const getUserByUsername = (username) => User.findOne({ username })

export const createUser = (values) => new User(values).save().then((user) => user.toObject())

export const updateUser = (id, values) => User.findByIdAndUpdate(id, values, { new: true })

export const verifyResetToken = async (token) => {
    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }
    })
    return user
}

export const generateResetToken = async (userId) => {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    await updateUser(userId, {
        resetToken,
        resetTokenExpiry
    })
    return resetToken
}

export const resetPassword = async (token, newPassword) => {
    const user = awaitverifyResetToken(token)
    if (!user) {
        return null
    }
    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    user.save()
    return user
}

export const generateVerificationToken = async (userId) => {
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString() // 6 digits

    await updateUser(userId, {
        verificationToken
    })
    return verificationToken
}

export const verifyVerificationToken = async (token) => {
    const user = await User.findOne({ verificationToken: token })
    return user
}