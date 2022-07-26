import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product");

dbConnect();
export const getDataCategory = async (categoryId) => {

  const products = await Product.find({ categoryId });

  return products;
};
export default async (req, res) => {
  try {
    const products = await getDataCategory(req.query.categoryId);

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
