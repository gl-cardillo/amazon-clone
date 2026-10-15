// shared by the migrations: dev by default, --prod for production, --apply to write

export const apply = process.argv.includes("--apply");
const prod = process.argv.includes("--prod");

export function targetUri() {
  const uri = prod ? process.env.PROD_MONGO_URI : process.env.MONGO_URI;
  if (!uri) {
    throw new Error(`${prod ? "PROD_MONGO_URI" : "MONGO_URI"} is not set`);
  }
  const db = new URL(uri).pathname.slice(1);
  console.log(
    `target: ${db}${apply ? "" : " (dry run, pass --apply to write)"}`,
  );
  return uri;
}
