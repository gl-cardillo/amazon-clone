import  dbConnect  from  "../../../utils/dbConnect";
const User = require('../../../models/User')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dbConnect()

export default async (req, res) => {
   const { email, name, password } = req.body;
    try {
      //if email is not available
      const userExists = await User.find({ email });
      if (userExists.length > 0) {
        return res.status(400).json({ message: "Email not available" });
      }
      // create hashed password for the account
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        name,
        password: hashedPassword,
      });

      const savedUser = await user.save();
      if (savedUser) {
        //create token
        const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({ user, token });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
  }
}