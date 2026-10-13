import mongoose from "mongoose";
import User from "../../models/User.ts";
import Review from "../../models/Review.ts";
import Product from "../../models/Product.ts";
import { apply, targetUri } from "./target.mts";

// lowercases every email, then builds the indexes declared in the models

await mongoose.connect(targetUri());
try {
  const users = mongoose.connection.collection("users");

  // two accounts that only differ in case would break the unique index
  const clashes = await users
    .aggregate([
      { $group: { _id: { $toLower: { $trim: { input: "$email" } } }, n: { $sum: 1 } } },
      { $match: { n: { $gt: 1 } } },
    ])
    .toArray();
  if (clashes.length > 0) {
    throw new Error(`emails that clash once lowercased: ${clashes.map((c) => c._id).join(", ")}`);
  }

  const toNormalize = await users
    .find({ $expr: { $ne: ["$email", { $toLower: { $trim: { input: "$email" } } }] } })
    .project({ email: 1 })
    .toArray();
  console.log(`emails to normalize: ${toNormalize.length}`);
  toNormalize.forEach((u) => console.log(`  ${u.email}`));

  if (apply) {
    await users.updateMany({}, [
      { $set: { email: { $toLower: { $trim: { input: "$email" } } } } },
    ]);
    for (const model of [User, Review, Product]) {
      await model.syncIndexes();
      const names = (await model.listIndexes()).map((i) => i.name).join(", ");
      console.log(`${model.collection.name} indexes: ${names}`);
    }
  }
} finally {
  await mongoose.disconnect();
}
