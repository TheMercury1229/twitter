import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected :${connect.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to DB:", error.message);
  }
};

export default connectDb;
