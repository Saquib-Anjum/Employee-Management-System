import jwt from "jsonwebtoken";

// ======================================================
// PROTECT AUTHENTICATED ROUTES
// ======================================================

function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Extract JWT
    // "Bearer eyJhbGci..."
    //          ↑
    //        token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Verify JWT
    const session = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded JWT to request
    req.session = session;

    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
}

// ======================================================
// ADMIN PROTECTION
// ======================================================

function protectAdmin(req, res, next) {
  if (req?.session?.role !== "ADMIN") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }

  next();
}

export { protect, protectAdmin };
