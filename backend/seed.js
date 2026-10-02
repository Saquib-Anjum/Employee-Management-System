import 'dotenv/config';
import connectDB from './config/db.js';
import userModel from './models/userModel.js';
import bcrypt from 'bcrypt'
const temporaryPassword = "admin123";
async function registerAdmin(){
  try{
const ADMIN_EMAIL =process.env.ADMIN_EMAIL;
if(!ADMIN_EMAIL){
  console.error("Missing ADMIN_EMAIL ");
  process.exit(1);

}
await connectDB();
const existingAdmin = await userModel.findOne({
  email:process.env.ADMIN_EMAIL
})
if(existingAdmin){
  console.log("User Already exist as role:  ", existingAdmin.role);
  process.exit(1);

}
const hashedPassword = await bcrypt.hash(temporaryPassword,10);
const admin = await userModel.create({
  email:process.env.ADMIN_EMAIL,
  password:hashedPassword,
  role:"ADMIN",
});

console.log("Admin usr created 🎃");
console.log("\nemail",admin.email);
console.log("passowrd: ",temporaryPassword);
console.log("\nchange the password after login. ");
process.exit(0);
  }catch(err){
    console.error("seed failed",err);
  }
}

registerAdmin();