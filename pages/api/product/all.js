import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product")

export const getAllProduct = async () => {
  await dbConnect();
  const products = await Product.find({});
  return products
};

export const searchProducts = async (query) => {
  await dbConnect();
  // escape regex characters so the query is matched literally
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Product.find({ name: { $regex: escaped, $options: "i" } });
};

export default async (req, res) => {
  await dbConnect();
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const products = await getAllProduct();
    return res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
