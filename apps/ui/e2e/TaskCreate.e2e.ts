import { Browser, launch, Page } from "puppeteer";
import { waitFor } from "@testing-library/react";

const port = process.env.PORT;
describe("Task Creation", () => {
  let page: Page;
  let browser: Browser;
  let createdTaskId: string | null = null;

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`);
  });

  afterAll(async () => {
    if (createdTaskId) {
      await deleteTask(createdTaskId);
    }
    await browser.close();
  });

  const deleteTask = async (taskId: string) => {
    await page.goto(`http://localhost:${port}/#/tasks/${taskId}`);
    await page.waitForSelector('button[aria-label="Delete"]');
    await page.click('button[aria-label="Delete"]');
    expect(page.url()).toMatch(/\/tasks$/);
    await page.waitForSelector('div[role="alert"]');
    await page.waitForFunction(
      () => !document.querySelector('div[role="alert"]')
    );
  };

  it("should create a new task and then delete it", async () => {
    await page.waitForSelector('a[href="#/tasks"]');
    await page.click('a[href="#/tasks"]');
    await page.waitForSelector('a[href="#/tasks/create"]');
    await page.click('a[href="#/tasks/create"]');
    await page.waitForSelector('input[name="title"]');
    await page.type('input[name="title"]', "New Task");

    await page.focus("div[contenteditable=true]");
    await page.type(
      "div[contenteditable=true]",
      "This is a new task created by e2e test",
      { delay: 100 }
    );

    for (const selector of [
      'div.MuiInputBase-root:has(input[name="status"])',
      'div.MuiInputBase-root:has(input[name="type"])',
      'div.MuiInputBase-root:has(input[name="priority"])',
      'div.MuiInputBase-root:has(input[name="assignedTo"])',
    ]) {
      await page.click(selector);
      await page.focus('li[aria-selected="false"][role="option"]');
      await page.click('li[aria-selected="false"][role="option"]');
      await page.waitForFunction(() => !document.querySelector('li[aria-selected="false"]'));
    }

    await page.click('button[type="submit"]');

    await page.waitForSelector('div[role="alert"]');
    const createAlertText = await page.$eval(
      'div[role="alert"]',
      (el) => el.textContent
    );
    expect(createAlertText).toMatch(/Element created/);

    // Extract the created task's ID
    const urlPattern = /\/tasks\/(\d+)/;
    const match = page.url().match(urlPattern);
    if (match) {
      createdTaskId = match[1];
    }
    expect(createdTaskId).not.toBeNull();
  });
});
