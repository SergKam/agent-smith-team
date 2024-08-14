import { Browser, launch, Page } from "puppeteer";

describe("App", () => {
  const port = process.env.PORT;
  let page: Page;
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should be titled ui", async () => {
    await expect(page.title()).resolves.toMatch("ui");
  });
});
