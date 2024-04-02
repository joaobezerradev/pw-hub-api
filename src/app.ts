import express from 'express'
import cors from 'cors'
import { DatabaseConnectionAdapter } from './infra/adapters/database'
import { environment } from './infra/config/environment'

new DatabaseConnectionAdapter().getConnection()

const app = express()

app.use(express.json())
app.use(cors())

app.listen(environment.app.port, () => { console.debug('Server has started at port:', environment.app.port) })
