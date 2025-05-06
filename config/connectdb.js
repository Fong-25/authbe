import mongoose from 'mongoose';

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri)
        console.log("MongoDB connected")
    } catch (error) {
        console.log("MongoDB connection failed: ", error)
        process.exit(1)
    }
};

export default connectDB;