import mongoose from "mongoose";
import Review from "../../models/Review.ts";
import { apply, targetUri } from "./target.mts";

// detaches older duplicate reviews from their account, then adds the unique index

await mongoose.connect(targetUri());
try {
  const reviews = mongoose.connection.collection("reviews");

  // newest first, so the first id in each group stays linked to the account
  const duplicates = await reviews
    .aggregate<{
      _id: { userId: string; productId: string };
      author: string;
      ids: mongoose.Types.ObjectId[];
    }>([
      { $sort: { date: -1 } },
      {
        $group: {
          _id: { userId: "$userId", productId: "$productId" },
          author: { $first: "$reviewAuthor" },
          ids: { $push: "$_id" },
        },
      },
      { $match: { "ids.1": { $exists: true } } },
    ])
    .toArray();
  const older = duplicates.flatMap((d) => d.ids.slice(1));
  console.log(
    `older duplicates to detach: ${older.length} across ${duplicates.length} user + product pairs`
  );
  duplicates.forEach((d) =>
    console.log(`  ${d.author}: ${d.ids.length} reviews on ${d._id.productId}`)
  );

  if (apply) {
    // a placeholder per review keeps the text and rating but ties it to no account
    const { modifiedCount } = await reviews.updateMany(
      { _id: { $in: older } },
      [{ $set: { userId: { $concat: ["legacy-", { $toString: "$_id" }] } } }]
    );
    console.log(`detached ${modifiedCount}, ${await reviews.countDocuments()} reviews kept`);
    await Review.syncIndexes();
    const names = (await Review.listIndexes()).map((i) => i.name).join(", ");
    console.log(`reviews indexes: ${names}`);
  }
} finally {
  await mongoose.disconnect();
}
