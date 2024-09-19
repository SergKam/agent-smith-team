import { tool } from "ai";
import { z } from "zod";
import { tryCatch } from "../lib/tryCatch";
import puppeteer from "puppeteer";
import { htmlToText } from "html-to-text";

export const readWeb = tool({
  description: `Fetch and return the text content of a web page from the WWW`,
  parameters: z.object({
    comment: z
      .string()
      .describe("A string that explains the reason for the command."),
    url: z
      .string()
      .url()
      .describe("The URL of the web page to fetch."),
  }),
  execute: tryCatch(async ({ comment, url }) => {
    console.log(`Fetching URL: ${url}`);
    console.log(comment);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const htmlContent = await page.content();
    await browser.close();

    return htmlToText(htmlContent, { wordwrap: 130 });
  }),
});
