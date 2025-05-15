// Modify existing user model 

import mongoose from 'mongoose';
import User from './models/user.model.js'
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        updateUserModel()
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB: ', error)
        process.exit(1)
    })

async function updateUserModel() {
    try {
        // add new fields with null values
        const result = await User.updateMany(
            // Replace resetToken and default value with the desired field name if want to add new field
            // { resetToken: { $exists: false } }, // Find users without resetToken
            // { $set: { resetToken: null, resetTokenExpiry: null } } // add fields
            { isVerified: { $exists: false } },
            { $set: { isVerified: false, verificationToken: Math.floor(100000 + Math.random() * 900000).toString() } }
        )
        console.log(`Updated ${result.modifiedCount} users`)

        const count = await User.countDocuments()
        console.log(`Total users: ${count}`)

        mongoose.disconnect()
        console.log('Migration successful')
    } catch (error) {
        console.error('Migration error: ', error)
        mongoose.disconnect()
        process.exit(1)
    }
}