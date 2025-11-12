import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['API_KEY'];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || './database.sqlite',
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  isDevelopment: () => (process.env.NODE_ENV || 'development') === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test'
};

if (config.isDevelopment()) {
  const mask = (v) => (v ? '***' + String(v).slice(-4) : 'NOT SET');
  console.log('Configuration loaded:');
  console.log(`   PORT: ${config.port}`);
  console.log(`   NODE_ENV: ${config.nodeEnv}`);
  console.log(`   DATABASE_URL: ${config.databaseUrl}`);
  console.log(`   API_KEY: ${mask(config.apiKey)}`);
}

export default config;
