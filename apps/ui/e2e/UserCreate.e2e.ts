import { Browser, launch, Page } from "puppeteer";

const port = process.env.PORT;
describe("User Creation", () => {
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

  it("should create a new user", async () => {
    await page.click('a[href="#/users"]');
    await page.click('a[href="#/users/create"]');
    await page.type('input[name="name"]', "New User");
    await page.click('button[type="submit"]');

    // Check if the user is created successfully
    await page.waitForSelector('div[role="alert"]');
    const alertText = await page.$eval(
      'div[role="alert"]',
      (el) => el.textContent
    );
    expect(alertText).toMatch(/Element created/);
  });
});
