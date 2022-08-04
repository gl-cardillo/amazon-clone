import dbConnect from "../../../utils/dbConnect";
const Product = require("../../../models/Product")

dbConnect();

export const getAllProduct = async () => {
  const products = await Product.find({});
  return products
};

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        const products = await getAllProduct();
        if (!products) {
          return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(products);
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
      }
      break;
    case "POST":
      // try {
      //   console.log(req.body);
      //   const {
      //     name,
      //     description,
      //     description2,
      //     description3,
      //     price,
      //     categoryId,
      //     categoryName,
      //     subcategory,
      //     manufacturer,
      //     picUrl,
      //     picUrl2,
      //     picUrl3,
      //   } = req.body;
      //   const newProduct = await new Product({
      //     name,
      //     description,
      //     description2,
      //     description3,
      //     price,
      //     categoryId,
      //     categoryName,
      //     subcategory,
      //     manufacturer,
      //     picUrl,
      //     picUrl2,
      //     picUrl3,
      //   });
      //   console.log(newProduct);
      //   await newProduct.save();
      //   return res.status(200).json("done");
      // } catch (err) {
      //   console.log(err);
      //   return res.status(500).json({ message: error.message });
      // }
      break;
    default:
      break;
  }
};
