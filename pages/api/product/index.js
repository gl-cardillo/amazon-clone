import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product");

dbConnect();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const products = await Product.find();
        return res.status(200).json(products);
      } catch (error) {
        console.log(error);
        return res.status(404).json({ message: error.message });
      }
      break;
    case "POST":
      try {
        console.log(req.body);
        const {
          name,
          description,
          description2,
          description3,
          price,
          category,
          subcategory,
          manufacturer,
          picUrl,
          picUrl2,
          picUrl3,
        } = req.body;
        const newProduct = await new Product({
          name,
          description,
          description2,
          description3,
          price,
          category,
          subcategory,
          manufacturer,
          picUrl,
          picUrl2,
          picUrl3,
        });
        console.log(newProduct);
        await newProduct.save();
        return res.status(200).json("done");
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: error.message });
      }
      break;
    default:
      break;
  }
};
