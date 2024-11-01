import mongoose from 'mongoose'
import {config} from'dotenv'
config()

const connectToDb = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("Connection successful")
    } catch (error) {
        console.log("Connection Failed:- "+error)
    }
}
export default connectToDb;