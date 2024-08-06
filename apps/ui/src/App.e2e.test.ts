const port = process.env.PORT;
describe("App", () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/`);
  });

  it("should be titled ui", async () => {
    await expect(page.title()).resolves.toMatch("ui");
  });
});
