const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  cart: { type: Array },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
