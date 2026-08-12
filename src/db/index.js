
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connection is successful");
        console.log("Database:", mongoose.connection.name);

    } catch (error) {
        console.log("MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;