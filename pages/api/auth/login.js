import dbConnect from "../../../utils/dbConnect";
const User = require("../../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dbConnect();

export default async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.emailLogin });
    // if user is the test account, set the right password
    //   if (req.body.email === "test-account@example.com") {
    //   req.body.password = process.env.TEST_PASSWORD;
    // }
    if (!user)
      return res.status(404).json({ message: "Credentials are incorrect" });
    // compare the password and create token
    const comparedPassword = await bcrypt.compare(
      req.body.passwordLogin,
      user.password
    );

    if (comparedPassword) {
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ user, token });
    } else {
      return res.status(400).json({ message: "Credentials are incorrect" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Sorry, try again later" });
  }
};
