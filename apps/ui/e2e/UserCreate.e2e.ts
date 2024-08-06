const port = process.env.PORT;
describe("User Creation", () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:${port}/`);
  });

  it("should create a new user", async () => {
    await page.click('a[href="#/users"]');
    await page.click('a[href="#/users/create"]');
    await page.type('input[name="name"]', 'New User');
    await page.click('button[type="submit"]');

    // Check if the user is created successfully
    await page.waitForSelector('div[role="alert"]');
    const alertText = await page.$eval('div[role="alert"]', el => el.textContent);
    expect(alertText).toMatch(/Element created/);
  });
});
