import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product");

dbConnect();

export const getDataSubcategory = async (subcategory) => {
  const products = await Product.find({ subcategory });
  return products
};

export default async (req, res) => {
  try {
    const products = await getDataSubcategory(req.query.subcategory);
    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
