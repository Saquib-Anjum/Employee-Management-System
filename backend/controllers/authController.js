import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
//login for employee and admin
//POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password, role_type } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and pasword are required",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    if (role_type === "admin" && user.role != admin) {
      return res.status(401).json({
        error: "not authorize as admin",
      });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    const token = generateToken(payload);
    return res.json({
      user:payload,
      token,
    });
  } catch (err) {}
}
//get session for employee and admin;
// GET /api/auth/session
async function session( req , res){
 const session= req.session;
 res.json({
  user:session
 })
}
//change password for employee and admin;
//POST /api/auth/change-password
async function changePassword( req, res){
  try{
   const session = req.session;
   const {currentPassword,newPassword} = req.body;
   if(!currentPassword || !newPassword){
    return res.status(400).json({
error:"Both password are required"
    })
   }
  const user = await userModel.findById(session.userId);
  if(!user){
    return res.status(404).json({
      error:"User not found"
    })
  }
 
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if(!isValid){
    return res.status(400).json({
      error:"Current password is incorrect"
    })
  }
  const hashed = await bcrypt.hash(newPassword,10);
  await userModel.findByIdAndUpdate(session.userId,{
    hashed
  })
return  res.json({
  success:true
})
  }catch(err){
return res.status(500).json({
  error:"Failed to change the password"
})
  }
}
//export
export {login , session,changePassword}