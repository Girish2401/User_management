const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes");
const cron = require("node-cron");
const User = require("./users/users.model");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "PUT", "POST", "DELETE"],
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/", router);

app.listen(port, () => {
  console.log(`started listening on ${port}`);
});

connect();

async function connect() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database is connected");
  } catch (error) {
    console.log(error);
  }
}
cron.schedule("* * * * *", async () => {
  const now = Date.now();

  try {
    const lockedUsers = await User.find({
      lock_until: { $ne: null },
      lock_until: { $lt: now },
    });

    lockedUsers.forEach(async (user) => {
      user.lock_until = null;
      user.failed_login_attempts = 0;
      user.is_locked = false;
      await user.save();
    });
  } catch (err) {
    console.error("Error unlocking accounts:", err);
  }
});
