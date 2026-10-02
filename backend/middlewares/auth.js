import jwt from "jsonwebtoken";
async function protect(req, res, next) {
  try {
    const authHeader = req.header.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[0];
    const session = jwt.verify(token, process.env.JWT_SECRET);
    if (!session) {
      res.status(401).josn({
        error: "Unauthorized",
      });
    }
    req.session = session;
    next();
  } catch (err) {}
}

//admin protect
async function protectAdmin(req, res,next){
  if(req?.session?.role !=="AMDIN"){
    return res.status(403).json({
      error:"Admin access required"
    })
  }
  next()
}
export { protect,protectAdmin};