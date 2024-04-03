import * as env from 'env-var'
import { config } from 'dotenv'

config()

const APP_PORT = env.get('APP_PORT').required().asIntPositive()
const DATABASE_PORT = env.get('DATABASE_PORT').required().asIntPositive()
const DATABASE_PASSWORD = env.get('DATABASE_PASSWORD').required().asString()
const DATABASE_USER = env.get('DATABASE_USER').required().asString()
const DATABASE_HOST = env.get('DATABASE_HOST').required().asString()
const DATABASE_TYPE = env.get('DATABASE_TYPE').required().asString()
const DATABASE_NAME = env.get('DATABASE_NAME').required().asString()

export const environment = {
  app: { port: APP_PORT },
  jwt: { secret: '' },
  db: { type: DATABASE_TYPE, port: DATABASE_PORT, pass: DATABASE_PASSWORD, user: DATABASE_USER, host: DATABASE_HOST, name: DATABASE_NAME }
}
