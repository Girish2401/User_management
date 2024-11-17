const User = require("../users/users.model");

exports.unlockUserAccount = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    if (!user.is_locked)
      return res.status(400).json({ msg: "User account is not suspended." });
    user.is_locked = false;
    user.failed_login_attempts = 0;
    user.lock_until = null;
    const updatedUser = await user.save();
    res.status(200).json({ msg: "user account suspension revoked" });
  } catch (error) {}
};
