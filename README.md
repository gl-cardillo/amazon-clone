# Shop Clone

<br/>

## Description:

---

This is an amazon clone app made with Next.js, TypeScript, Tailwind and MongoDB.

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

Check the [demo](https://amazon-clone-git-main-gl-cardillo.vercel.app/)

<br/>

## Local setup:

---

Requires Node 22 and access to the MongoDB cluster.

1. `npm install`
2. Create `.env.local` with `MONGO_URI` (a database whose name ends in `-dev`), `PROD_MONGO_URI`, `ACCESS_TOKEN_SECRET` and `TEST_PASSWORD`.
3. `npm run db:reset` copies the products and reviews from production into the dev database and runs the migrations. It refuses any database whose name doesn't end in `-dev` or `-test`.
4. `npm run dev` and open http://localhost:3000

<br/>

## Scripts:

---

| Command | What it does |
| --- | --- |
| `npm run dev` | start the dev server |
| `npm run build` / `npm start` | production build and server |
| `npm run lint` / `npm run typecheck` | eslint and tsc |
| `npm run db:reset` | reseed the dev database and run every migration |
| `npm run seed` | only the copy step of `db:reset` |
| `npm run migrate -- scripts/migrations/<file>` | dry run a migration on dev |
| `npm run migrate -- scripts/migrations/<file> --apply` | apply it on dev |
| `npm run migrate -- scripts/migrations/<file> --prod --apply` | apply it on production |

Migrations are safe to run more than once. Run them in number order, on production before deploying the code that needs them.
