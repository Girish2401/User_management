const express = require("express");
const router = express();

const userRouter = require("./users");
const adminController = require("./admin/admin.controller");

router.use("/api", userRouter);
router.put("/api/admin/revokeUser/:id", adminController.unlockUserAccount);

module.exports = router;
