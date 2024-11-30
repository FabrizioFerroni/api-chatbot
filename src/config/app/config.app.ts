import { ConfigApp } from '@/config/types/config.app.type';

export const configApp = (): ConfigApp => {
  return {
    env: process.env.NODE_ENV || 'development',
    apiPort: Number(process.env.API_PORT) || 8080,
    limit: Number(process.env.THROTTLE_LIMIT) || 10,
    ttl: Number(process.env.THROTTLE_TTL) || 6000,
    max_pass_failures: Number(process.env.MAX_PASS_FAILURES),
    passPrivateKey: process.env.PASSWORD_PRIVATE_KEY,
    secret_jwt: process.env.SECRET_JWT || '',
    secret_jwt_register: process.env.SECRET_JWT_REGISTER || '',
    secret_jwt_refresh: process.env.SECRET_JWT_REFRESH || '',
    mailServiceUrl: process.env.URL_MAIL_SERVICE || '',
    appHost: process.env.APP_FRONT_HOST || 'localhost',
    appMail: process.env.APP_MAIL || '',
    appImg: process.env.APP_IMG || '',
    exchange: process.env.APP_EXCHANGE || '',
    appColor: process.env.APP_COLOR || '',
    appEmailFrom: process.env.APP_EMAIL_FROM || '',
    fileDest: process.env.FILES_DEST || '',
    tz: process.env.TZ || '',
    pathPrivateKey: process.env.PATH_PRIVATE_KEY,
    hostMethod: process.env.HOST_METHODS,
    hostAllowedHeader: process.env.HOST_ALLOWED_HEADERS,
    hostCredentials: Boolean(process.env.HOST_CREDENTIALS),
    frontHost: process.env.FRONT_HOST,
    emailDefaultFabrizio: process.env.EMAIL_DEFAULT_FABRIZIO || '',
    passwordDefaultFabrizio: process.env.PASSWORD_DEFAULT_FABRIZIO || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      username: process.env.REDIS_USERNAME || '',
      password: process.env.REDIS_PASSWORD || '',
      ttl: Number(process.env.REDIS_TTL) || 30000,
    },

    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_BASEDATOS || '',
      timezone: process.env.DATABASE_TIMEZONE || '',
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
      secret_jwt_google: process.env.SECRET_JWT_GOOGLE || '',
    },
  };
};
