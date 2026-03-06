import "process";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`❌ Missing Environment Variable: ${key}`);
  }
  return value;
};

export const config = {
  env: getEnv("NODE_ENV", "development"),
  port: parseInt(getEnv("PORT", "3000"), 10),
  database: {
    url: getEnv("DATABASE_URL"),
  },
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
