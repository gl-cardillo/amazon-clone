import dbConnect from "../../../utils/dbConnect";
import { getAverageReview } from "../review/getRating/[productId]";
const Product = require("../../../models/Product");

dbConnect();

export const getDataSubcategory = async (subcategory) => {
  const products = await Product.find({ subcategory });
  const productsAndAverage = [];
  //get review for each product
  for (let i = 0; i < products.length; i++) {
    const average = await getAverageReview(products[i]._id);
    productsAndAverage.push({ reviewAverage: average, product: products[i] });
  }

  return productsAndAverage;
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
