import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product");

dbConnect();

export default async (req, res) => {
  try {

    const products = await Product.find({ categoryId: req.query.categoryId });
    console.log(products)
    return res.status(200).json(products);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
