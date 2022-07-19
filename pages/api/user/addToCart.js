import dbConnect from "../../../utils/dbConnect";
const User = require("../../../models/User");

dbConnect();

export default async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    user.cart.push({
      productId: req.body.productId,
      quantity: req.body.quantity,
    });

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: error.message });
  }
};
