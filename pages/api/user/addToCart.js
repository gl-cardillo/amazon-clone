import dbConnect from "../../../utils/dbConnect";
import verifyToken from "../../../utils/verifyToken";
const User = require("../../../models/User");

dbConnect();

export default async (req, res, next) => {
  try {
    const result = verifyToken(req);
    if (!result) {
      return res.status(403).json({ message: "User not loged in " });
    }
    const user = await User.findById(result.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart.push({
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
