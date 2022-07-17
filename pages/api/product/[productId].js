import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product");

dbConnect();

export default async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    return res.status(500);
  }
};
