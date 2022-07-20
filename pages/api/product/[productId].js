import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product");

dbConnect();

export default async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
