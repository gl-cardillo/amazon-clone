import dbConnect from "../../../utils/dbConnect";
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dbConnect();

export default async (req, res, next) => {
    console.log(req.body)
  try {
    const user = await User.findOne({ email: req.body.emailLogin });
    // if user is the test account, set the right password
    //   if (req.body.email === "test-account@example.com") {
    //   req.body.password = process.env.TEST_PASSWORD;
    // }
    if (!user) return res.status(404).json({ message: "User not found" });
    // compare the password and create token
    const comparedPassword = await bcrypt.compare(
      req.body.passwordLogin,
      user.password
    );

    if (comparedPassword) {
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ user, token });
    } else {
      console.log(console.log(req.body.password));
      return res.status(400).json({ message: "Password is incorrect" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
