import * as writeFile from './writeFile';
import * as deleteFile from './deleteFile';
import * as renameFile from './renameFile';
import * as callNpm from './callNpm';
import { ChatCompletionTool } from 'openai/src/resources/chat/completions';

export type Command = {
  definition: ChatCompletionTool;
  handler: Function;
};
export const functions: Command[] = [writeFile, deleteFile, renameFile, callNpm];
