import { DataSource } from 'typeorm'
import { environment } from '../../../config/environment'
import { type MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { type DatabaseConnection } from '../../contracts/database-connection'

export class DatabaseConnectionAdapter implements DatabaseConnection<DataSource> {
  private readonly dataSource: DataSource

  constructor () {
    const entitiesPath = join(__dirname, './mapping')
    this.dataSource = new DataSource({
      type: environment.db.type as MysqlConnectionOptions['type'],
      host: environment.db.host,
      port: environment.db.port,
      username: environment.db.user,
      password: environment.db.pass,
      database: environment.db.name,
      entities: this.getEntitiesPath(entitiesPath)
    })

    this.dataSource.initialize().catch(console.error)
  }

  getConnection (): DataSource {
    return this.dataSource
  }

  private getEntitiesPath (entitiesPath: string): string[] {
    const entityFiles = readdirSync(entitiesPath).filter(file => !file.startsWith('base'))
    return entityFiles.map(file => join(entitiesPath, file))
  }
}
