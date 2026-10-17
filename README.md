# Storefront

<br/>

## Description:

---

An e-commerce store made with Next.js, TypeScript, Tailwind and MongoDB.

<br/>

## Functionalities:

---

- Create a profile and delete profile.
- Sign in and log out.
- Search and browse products.
- Add and remove product from cart.
- Review product with star rating.
- Sort review by most recent or highest rating.
- Filter review by rating.
- Change details like address, city etc.
- change currency ($, €, £).

## Link

---

Check the [demo](https://glc-storefront.vercel.app/)

<br/>

## Local setup:

---

Requires Node 22 and access to the MongoDB cluster.

1. `npm install`
2. Create `.env.local` with `MONGO_URI` (a database whose name ends in `-dev`), `PROD_MONGO_URI`, `ACCESS_TOKEN_SECRET` and `TEST_PASSWORD`.
3. `npm run db:reset` copies the products and reviews from production into the dev database and builds the indexes. It refuses any database whose name doesn't end in `-dev` or `-test`.
4. `npm run dev` and open http://localhost:3000

<br/>

## Scripts:

---

| Command                                   | What it does                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`                             | start the dev server                                                            |
| `npm run build` / `npm start`             | production build and server                                                     |
| `npm run lint` / `npm run typecheck`      | eslint and tsc                                                                  |
| `npm run format` / `npm run format:check` | format with prettier, or only check                                             |
| `npm run test:e2e`                        | build, start on port 3100 and run the Playwright tests against the dev database |
| `npm run db:reset`                        | reseed the dev database from production and build the indexes                   |

Before the first `npm run test:e2e`, download the browser with `npx playwright install chromium`. CI runs lint, typecheck and format check on every push and pull request; the build is checked by Vercel.
