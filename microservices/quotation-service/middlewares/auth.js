const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ DO THIS IN MICROSERVICES
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid credentials",
      error: err.message
    });
  }
};

module.exports = auth;