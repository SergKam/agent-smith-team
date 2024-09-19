export const config = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return process.env[name];
};
