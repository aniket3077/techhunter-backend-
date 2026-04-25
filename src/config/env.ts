const nodeEnv = process.env.NODE_ENV ?? "development";

export const env = {
  NODE_ENV: nodeEnv,
  APP_NAME: process.env.APP_NAME ?? "techhunter-backend",
};

export const isProduction = nodeEnv === "production";
