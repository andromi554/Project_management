
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from "mongoose";
import 'dotenv/config';
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connection is successful");


    }catch(error){
        console.log("Mongodb connections failed: ",error);
        process.exit(1);
    }

}

export default connectDB;