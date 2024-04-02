import { type DataSource, type Repository } from 'typeorm'
import { type Account } from '../../../../../domain/entities/account'
import { type AccountRepositoryInterface } from '../../../../../domain/repositories/account-repository'
import { type DatabaseConnection } from '../../../contracts'
import { AccountMapping } from '../mapping/account'

export class AccountRepository implements AccountRepositoryInterface {
  private readonly accountRepository: Repository<AccountMapping>

  constructor (dataSource: DatabaseConnection<DataSource>) {
    this.accountRepository = dataSource.getConnection().getRepository(AccountMapping)
  }

  async finOneBy (data: Partial<Account>): Promise<Account | null> {
    throw new Error('Method not implemented.')
  }

  async finBy (data: Partial<Account>): Promise<Account[]> {
    throw new Error('Method not implemented.')
  }

  async save (data: Account): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
