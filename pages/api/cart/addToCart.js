import dbConnect from "../../../utils/dbConnect";
import verifyToken from "../../../utils/verifyToken";
const User = require("../../../models/User");
const Product = require("../../../models/Product");

dbConnect();

export default async (req, res, next) => {
  switch (req.method) {
    case "POST":
      try {
        const result = verifyToken(req);
        if (!result) {
          return res.status(403).json({ message: "User not loged in " });
        }
        const user = await User.findById(result.user._id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        //check if procuts is in the cart
        const index = user.cart.findIndex(
          (cart) => cart.productId === req.body.productId
        );
        // if product is not in the cart add
        if (index === -1) {
          user.cart.push({
            productId: req.body.productId,
            quantity: req.body.quantity,
          });
        } else {
          // if product is in the cart increament quantity
          user.cart[index].quantity += req.body.quantity;
        }
        user.markModified("cart");
        await user.save();

        return res.status(200).json(user);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
      }
    case "PUT":
      try {
        const result = verifyToken(req);
        if (!result) {
          return res.status(403).json({ message: "User not loged in " });
        }
        const user = await User.findById(result.user._id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        //check if procuts is in the cart
        const index = user.cart.findIndex(
          (cart) => cart.productId === req.body.productId
        );

        if (req.body.n === "+1") {
          user.cart[index].quantity += 1;
        } else {
          user.cart[index].quantity -= 1;
        }
        user.markModified("cart");
        await user.save();

        return res.status(200).json(user);
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
      }
    case "DELETE":
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
            break;
          }
        }
        user.markModified("cart");
        await user.save();
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
  }
};
