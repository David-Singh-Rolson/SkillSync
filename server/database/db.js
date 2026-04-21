import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://davidsinghrolson:DXNI2mGjZLEejvUx@cluster0.ruleu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('MongoDB Connected');
    } catch (error) {
        console.log("error occured", error); 
    }
}
export default connectDB;