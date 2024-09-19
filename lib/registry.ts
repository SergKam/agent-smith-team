import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { experimental_createProviderRegistry as createProviderRegistry } from "ai";

export const registry = createProviderRegistry({
  // register provider with prefix and default setup:
  anthropic: createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  }),

  // register provider with prefix and custom setup:
  openai: createOpenAI({
    apiKey: process.env.OPENAI_KEY,
  }),

  groq: createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  }),
});
