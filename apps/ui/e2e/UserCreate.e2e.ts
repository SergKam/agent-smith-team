import { Browser, launch, Page } from "puppeteer";

const port = process.env.PORT;
describe("User Creation", () => {
  let page: Page;
  let browser: Browser;
  let createdUserId: string | null = null;

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);
  });

  afterAll(async () => {
    if (createdUserId) {
      await deleteUser(createdUserId);
    }
    await browser.close();
  });

  const deleteUser = async (userId: string) => {
    await page.goto(`http://localhost:${port}/#/users/${userId}`);
    await page.waitForSelector('button[aria-label="Delete"]');
    await page.click('button[aria-label="Delete"]');
    expect( page.url()).toMatch(/\/users$/);
    await page.waitForSelector('div[role="alert"]');
    await page.waitForFunction(() => !document.querySelector('div[role="alert"]'));
  };

  it("should create a new user and then delete it", async () => {
    // Create user
    await page.click('a[href="#/users"]');
    await page.click('a[href="#/users/create"]');
    await page.type('input[name="name"]', "New User");
    await page.click('button[type="submit"]');

    await page.waitForSelector('div[role="alert"]');
    const createAlertText = await page.$eval(
      'div[role="alert"]',
      (el) => el.textContent
    );
    expect(createAlertText).toMatch(/Element created/);

    // Extract the created user's ID
    const urlPattern = /\/users\/(\d+)/;
    const match = page.url().match(urlPattern);
    if (match) {
      createdUserId = match[1];
    }
    expect(createdUserId).not.toBeNull();
  });
});
