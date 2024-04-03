import * as bcrypt from 'bcryptjs'
import { type HasherInterface } from '../contracts'

export class HasherAdapter implements HasherInterface {
  private readonly saltRounds = 10

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.saltRounds)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
