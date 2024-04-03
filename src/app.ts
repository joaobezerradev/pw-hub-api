import cluster from 'node:cluster'
import os from 'node:os'
import express from 'express'
import fs from 'node:fs/promises'
import path from 'path'
import { DatabaseConnectionAdapter } from './infra/adapters/database'
import { environment } from './infra/config/environment'

const app = express()
app.use(express.json())

const databaseConnection = new DatabaseConnectionAdapter()

async function loadRoutes (): Promise<void> {
  const routesPath = path.resolve(__dirname, 'infra', 'http', 'routes')
  const routeFiles = await fs.readdir(routesPath)

  for (const file of routeFiles) {
    const filePath = path.join(routesPath, file)
    const route = (await import(filePath)).default
    app.use('/api', route(databaseConnection))
  }
}

async function bootstrap (): Promise<void> {
  await loadRoutes()
  app.listen(environment.app.port)
}

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', () => {
    cluster.fork()
  })

  console.log(`Server listening on port ${environment.app.port}`)
} else {
  bootstrap()
    .catch((error) => {
      console.error(`Worker ${process.pid} failed to start: ${error.message}`)
      process.exit(1)
    })
}
