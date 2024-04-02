export interface DatabaseConnection<T> {
  getConnection: () => T
}
