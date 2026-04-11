import mongoose from "mongoose";

export const connectDB= async () => {
    await mongoose.connect('mongodb+srv://Prachi:Prachi123456@test.jgk2uvj.mongodb.net/',{
    dbName:'task_db'
    })
        .then(() => {
        console.log('DATABASE CONNECTED')
    })
    .catch((err) => {
    console.error(err)
});
}   
export default connectDB;

