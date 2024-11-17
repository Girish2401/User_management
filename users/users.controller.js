const User = require("./users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret_key";
const saltRounds = 10;

exports.addUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email is already registered." });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    let user = new User({ ...req.body });
    await user.save();
    res.status(201).json({ msg: "User registered successfully!!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User is not registerd!!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failed_login_attempts += 1;
      if (user.failed_login_attempts > 2) {
        user.is_locked = true;
        user.lock_until = Date.now() + 30 * 60 * 1000;
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, user, {
        new: true,
      });
      if (user.is_locked)
        return res.status(400).json({
          message: `No of attempts exceeded.Account got suspended`,
        });
      return res.status(400).json({
        message: `Password is not correct.${
          3 - user.failed_login_attempts
        } attempts remaining before account gets suspended.`,
      });
    }
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getUserDetails = async (req, res) => {
  return res.status(200).json(req.user);
};
