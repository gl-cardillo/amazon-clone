import {
  test,
  expect,
  deleteAccount,
  productPath,
  signUp,
  uniqueEmail,
  visit,
} from "./fixtures";

test("a user can review a product once", async ({ page, request }) => {
  const text = `Browser test review ${Date.now()}`;
  const product = await productPath(request, 5);
  const leaveReview = page.getByRole("heading", { name: "Leave a review" });
  const reviewed = page.getByText("You reviewed this product");

  await signUp(page, "Review Tester", uniqueEmail("e2e-reviews"));
  await visit(page, product);
  await expect(leaveReview).toBeVisible();

  await test.step("ask for a star", async () => {
    await page.getByLabel("Your review").fill("no stars yet");
    await page.getByRole("button", { name: "Add review" }).click();
    await expect(page.getByText("Select a star")).toBeVisible();
  });

  await test.step("post the review", async () => {
    await page.getByRole("button", { name: "Rate 4 stars" }).click();
    await page.getByLabel("Your review").fill(text);
    await page.getByRole("button", { name: "Add review" }).click();
    await expect(reviewed).toBeVisible();
    await expect(leaveReview).toHaveCount(0);
    await expect(page.getByText(text)).toBeVisible();
    await page.reload();
    await expect(reviewed).toBeVisible();
  });

  await test.step("deleting the account removes the review", async () => {
    await deleteAccount(page);
    await visit(page, product);
    await expect(page.getByText(text)).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Write a review" }),
    ).toBeVisible();
  });
});
