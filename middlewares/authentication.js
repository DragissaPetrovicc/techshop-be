const { config } = require("dotenv");
config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).send("Unauthorized");

    const parts = authorization.split(" ");
    const token = parts[1];

    if (!token) return res.status(401).send("No token provided");

    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).send("Try again");
    req.role = decoded.role;
    next();
  } catch (e) {
    res
      .status(400)
      .send(e?.message || "Something went wrong,please log in later");
  }
};

const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.role !== role && req.role !== "ADMIN")
      return res.status(403).send("Access Forbidden!!!");
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
