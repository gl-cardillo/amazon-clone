import { test, expect, visit } from "./fixtures";

test("logged out pages redirect to sign in", async ({ page }) => {
  for (const path of ["/cart", "/profile"]) {
    await page.goto(path);
    await expect(page).toHaveURL("/signin");
  }
});

test("search suggests products and opens the results", async ({ page }) => {
  await visit(page, "/");
  const search = page.getByRole("textbox", { name: "Search products" });
  await search.fill("phone");
  await expect(
    page
      .getByRole("group", { name: "Search suggestions" })
      .getByRole("link")
      .first(),
  ).toBeVisible();

  await search.press("Enter");
  await expect(page).toHaveURL("/search?q=phone");
  await expect(page.getByRole("main").getByRole("link")).toHaveCount(3);
});
