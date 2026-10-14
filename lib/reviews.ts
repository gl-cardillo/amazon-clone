import dbConnect from "@/utils/dbConnect";
import Review from "@/models/Review";

// one query for any number of products, products without reviews are absent
export async function getAverageRatings(productIds: string[]) {
  await dbConnect();
  const rows = await Review.aggregate<{ _id: string; average: number }>([
    { $match: { productId: { $in: productIds } } },
    { $group: { _id: "$productId", average: { $avg: "$rating" } } },
  ]);
  return new Map(rows.map((row) => [row._id, row.average]));
}

export async function getAverageRating(productId: string) {
  const averages = await getAverageRatings([productId]);
  return averages.get(productId) ?? 0;
}

export async function getReviewSummary(productId: string) {
  await dbConnect();
  const reviews = await Review.find({ productId }).sort({ date: -1 });
  // index is the star count, index 0 is unused
  const ratingArray: (number | null)[] = [null, 0, 0, 0, 0, 0];
  let total = 0;
  for (const review of reviews) {
    ratingArray[review.rating] = (ratingArray[review.rating] ?? 0) + 1;
    total += review.rating;
  }
  const average = reviews.length > 0 ? total / reviews.length : 0;
  return { reviews, ratingArray, average };
}

export async function hasReviewed(userId: string, productId: string) {
  await dbConnect();
  return Boolean(await Review.exists({ userId, productId }));
}

export async function createReview(review: {
  productId: string;
  userId: string;
  reviewAuthor: string;
  text: string;
  rating: number;
}) {
  await dbConnect();
  return Review.create(review);
}
