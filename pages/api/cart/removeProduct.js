import dbConnect from "../../../utils/dbConnect";
import verifyToken from "../../../utils/verifyToken";
const User = require("../../../models/User");
const Product = require("../../../models/Product");

dbConnect();

export default async (req, res) => {
  try {
    const result = verifyToken(req);
    if (!result) {
      return res.status(403).json({ message: "User not loged in " });
    }
    const user = await User.findById(result.user._id);

    //check if procuts is in the cart
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].productId === req.body.productId) {
        user.cart.splice(i, 1);
        return;
      }
    }
    user.markModified("cart");
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
