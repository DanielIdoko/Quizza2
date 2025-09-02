import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js'

const connectToDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Connected to db successfully");
    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
}

export default connectToDb;