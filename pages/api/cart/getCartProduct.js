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

    let products = [];
    for (let i = 0; i < user.cart.length; i++) {
      const product = await Product.findById(user.cart[i].productId);

      if (product) {
        const productCart = { product, quantity: user.cart[i].quantity };
        products.push(productCart);
      }
    }
    return res.status(200).json({ cart: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
