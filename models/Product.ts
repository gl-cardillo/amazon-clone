import mongoose, { type InferSchemaType, type Model } from "mongoose";

// destructured so plain node scripts can import the models too
const { Schema, model, models } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  manufacturer: { type: String },
  picUrl: { type: String, required: true },
  picUrl2: { type: String },
  picUrl3: { type: String },
  description: { type: String },
  description2: { type: String },
  description3: { type: String },
  categoryId: { type: String, required: true },
  categoryName: { type: String },
  subcategory: { type: String },
});

productSchema.index({ categoryId: 1 });
productSchema.index({ subcategory: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema>;

const Product =
  (models.Product as Model<ProductDocument> | undefined) ??
  model<ProductDocument>("Product", productSchema);

export default Product;
