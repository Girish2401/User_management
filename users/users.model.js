const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate(v) {
        if (!validator.isEmail(v)) {
          throw new Error("Email is invalid");
        }
      },
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      match: [
        /^(?:\+91|91)?[7-9][0-9]{9}$/,
        "Please provide a valid Indian phone number",
      ],
    },
    country: {
      type: String,
      required: true,
    },
    failed_login_attempts: {
      type: Number,
      default: 0,
    },
    is_locked: {
      type: Boolean,
      default: false,
    },
    lock_until: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_date",
      updatedAt: "modified_date",
    },
    versionKey: false,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
