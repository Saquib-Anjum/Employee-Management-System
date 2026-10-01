import mongoose from 'mongoose'
async function connectDB(){
try{
  mongoose.connection.on('connected',()=>{
    console.log("DB CONNECTED 🤗")
  })
  await mongoose.connect(process.env.MONGODB_URI)
}catch(err){
  console.log("DB Connection Failed",err.message);
}
}
export default connectDB