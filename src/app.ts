import cluster from 'node:cluster'
import os from 'node:os'
import express, { NextFunction, Request, Response } from 'express'
import fs from 'node:fs/promises'
import path from 'path'
import { DatabaseConnectionAdapter } from './infra/database'
import { environment } from './infra/config/environment'

const app = express()
app.use(express.json())
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.code || 500;
  res.status(statusCode).json({
    error: true,
    code: statusCode,
    message: err.message || 'Internal Server Error',
  });
});


const databaseConnection = new DatabaseConnectionAdapter()

async function loadRoutes(): Promise<void> {
  try {
    const routesPath = path.resolve(__dirname, 'infra', 'http', 'routes');
    const routeFiles = await fs.readdir(routesPath);

    for (const file of routeFiles) {
      const filePath = path.join(routesPath, file);
      const route = (await import(filePath)).default;
      app.use('/api', route(databaseConnection));
    }
  } catch (error) {
    console.error(`Error loading routes: ${error.message}`);
    throw error; // Re-lança o erro para ser capturado pelo chamador.
  }
}


async function bootstrap(): Promise<void> {
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
