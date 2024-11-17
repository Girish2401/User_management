const jwt = require("jsonwebtoken");
const User = require("../users/users.model");
const rateLimit = require("express-rate-limit");

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret_key";

const authenticatorjwt = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res.send(401).json({ msg: "Token missing,Authorization denied" });
  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ msg: "invalid or expired token" });
    next();
  });
};

const checkAccountSuspension = async (req, res, next) => {
  const userId = req.params.id;
  let user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: "user not found" });
  if (user.is_locked)
    return res
      .status(403)
      .json({ msg: "Account got suspended!!Action denied" });
  req.user = user;
  next();
};

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message:
    "Too many login attempts from this IP, please try again after 10 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
module.exports = { checkAccountSuspension, authenticatorjwt, loginRateLimiter };
