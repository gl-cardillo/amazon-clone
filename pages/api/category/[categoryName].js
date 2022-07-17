import dbConnect from "../../../utils/dbConnect";
import Product from "../../../models/Product";

dbConnect();

export default async (req, res) => {
  try {
    const products = await Product.find({ category: req.query.categoryName });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
