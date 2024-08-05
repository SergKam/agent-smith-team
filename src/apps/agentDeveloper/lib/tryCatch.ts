// Function to wrap a function in a try catch block to catch any errors and return a string with the error message.
export function tryCatch(fn: (a: any) => Promise<string>) {
  return async (a: any) => {
    try {
      return await fn(a);
    } catch (error: any) {
      return `Error: ${error}`;
    }
  };
}
