import dbConnect from "../../../utils/dbConnect";
import verifyToken from "../../../utils/verifyToken";
const User = require("../../../models/User");

dbConnect();

export default async (req, res) => {
  try {
    const { id, name, city, address, postcode, dateOfBirth } = req.body;
    const result = verifyToken(req);
    if (!result) {
      return res.status(403).json({ message: "User not loged in" });
    }
    const firstname = name.split(" ")[0];
     await User.findByIdAndUpdate(result.user._id, {
      firstname,
      name,
      dateOfBirth,
      city,
      address,
      postcode,
    });

    const user = await User.findById(result.user._id);

    return res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};
