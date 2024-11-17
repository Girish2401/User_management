const express = require("express");
const router = express.Router();
const userController = require("./users.controller");
const {
  authenticatorjwt,
  checkAccountSuspension,
  loginRateLimiter,
} = require("../middlewares");

router.post("/users", userController.addUser);
router.post("/login", loginRateLimiter, userController.login);
router.get(
  "/profile/:id",
  authenticatorjwt,
  checkAccountSuspension,
  userController.getUserDetails
);

module.exports = router;
