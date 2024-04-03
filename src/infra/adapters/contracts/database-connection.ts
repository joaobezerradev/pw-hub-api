export interface DatabaseConnectionInterface<T = any> {
  getConnection: () => T
}
