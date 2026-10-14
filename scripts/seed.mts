import mongoose from "mongoose";
import { TEST_ACCOUNT_EMAIL } from "../utils/constants.ts";

// copies the catalogue and the test account into a dev or test database

const source = process.env.PROD_MONGO_URI;
const target = process.env.MONGO_URI;
if (!source || !target) {
  throw new Error("PROD_MONGO_URI and MONGO_URI must both be set");
}

const dbName = (uri: string) => new URL(uri).pathname.slice(1);
const targetDb = dbName(target);
// the target is wiped, so refuse anything that isn't clearly a scratch database
if (targetDb === dbName(source) || !/-(dev|test)$/.test(targetDb)) {
  throw new Error(`refusing to seed "${targetDb}", it must end in -dev or -test`);
}

const from = await mongoose.createConnection(source).asPromise();
const to = await mongoose.createConnection(target).asPromise();

async function copy(collection: string, filter: Record<string, unknown> = {}) {
  const docs = await from.collection(collection).find(filter).toArray();
  // drop rather than empty, so indexes start from production's state too
  const existing = await to.db!.listCollections({ name: collection }).toArray();
  if (existing.length > 0) await to.dropCollection(collection);
  if (docs.length > 0) {
    await to.collection(collection).insertMany(docs);
  }
  console.log(`${collection}: copied ${docs.length}`);
}

// case-insensitive, production may still store it with capitals
const testAccountEmail = new RegExp(
  `^${TEST_ACCOUNT_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
  "i"
);

// stand-ins for review authors, so dev matches production without personal data
async function addReviewAuthors() {
  const authorIds = await from.collection("reviews").distinct("userId");
  const authors = await from
    .collection("users")
    .find({
      _id: { $in: authorIds.map((id) => new mongoose.Types.ObjectId(id)) },
      email: { $not: testAccountEmail },
    })
    .project({ _id: 1 })
    .toArray();
  const names = await from
    .collection("reviews")
    .aggregate([{ $group: { _id: "$userId", name: { $first: "$reviewAuthor" } } }])
    .toArray();
  const nameById = new Map(names.map((n) => [n._id, n.name]));
  if (authors.length > 0) {
    await to.collection("users").insertMany(
      authors.map(({ _id }) => ({
        _id,
        name: nameById.get(String(_id)) ?? "Reviewer",
        email: `reviewer-${_id}@example.invalid`,
        // not a valid bcrypt hash, so nobody can log in as a stand-in
        password: "!",
        cart: [],
      }))
    );
  }
  console.log(`users: added ${authors.length} review author stand-ins`);
}

try {
  await copy("products");
  await copy("reviews");
  // real users stay in production, only the shared test account is copied
  await copy("users", { email: testAccountEmail });
  await to
    .collection("users")
    .updateMany({}, [{ $set: { email: { $toLower: "$email" } } }]);
  await addReviewAuthors();
  console.log(`seeded ${targetDb} from ${dbName(source)}`);
} finally {
  await from.close();
  await to.close();
}
