import * as env from 'env-var'
import { config } from 'dotenv'

config()

export const environment = {
  app: {
    port: env.get('APP_PORT').required().asIntPositive(),
    tokenAccountExpiresInMinutes: env.get('TOKEN_ACCOUNT_EXPIRES_IN_MINUTES').required().asIntPositive()
  },
  mailer: {
    host: env.get('MAIL_HOST').required().asString(),
    port: env.get('MAIL_PORT').required().asIntPositive(),
    user: env.get('MAIL_USER').required().asString(),
    pass: env.get('MAIL_PASS').required().asString(),
    from: env.get('MAIL_FROM').required().asString()
  },
  jwt: {
    secret: env.get('JWT_SECRET').required().asString(),
    expirationIn: env.get('JWT_EXPIRATION').required().asString(),
    refreshExpirationIn: env.get('JWT_REFRESH_EXPIRATION').required().asString()
  },
  db: {
    type: env.get('DATABASE_TYPE').required().asString(),
    port: env.get('DATABASE_PORT').required().asIntPositive(),
    pass: env.get('DATABASE_PASSWORD').required().asString(),
    user: env.get('DATABASE_USER').required().asString(),
    host: env.get('DATABASE_HOST').required().asString(),
    name: env.get('DATABASE_NAME').required().asString()
  }
}
