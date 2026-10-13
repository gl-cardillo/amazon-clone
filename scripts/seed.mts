import mongoose from "mongoose";
import { TEST_ACCOUNT_EMAIL } from "../utils/constants.ts";

// copies the catalogue and the test account into a dev or test database

const source = process.env.SEED_SOURCE_MONGO_URI;
const target = process.env.MONGO_URI;
if (!source || !target) {
  throw new Error("SEED_SOURCE_MONGO_URI and MONGO_URI must both be set");
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
  await to.collection(collection).deleteMany({});
  if (docs.length > 0) {
    await to.collection(collection).insertMany(docs);
  }
  console.log(`${collection}: copied ${docs.length}`);
}

try {
  await copy("products");
  await copy("reviews");
  // real users stay in production, only the shared test account is copied
  await copy("users", { email: TEST_ACCOUNT_EMAIL });
  console.log(`seeded ${targetDb} from ${dbName(source)}`);
} finally {
  await from.close();
  await to.close();
}
