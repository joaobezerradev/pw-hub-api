export interface BaseRepository<T> {
  finOneBy: (data: Partial<T>) => Promise<T | null>
  finBy: (data: Partial<T>) => Promise<T[]>
  save: (data: T) => Promise<void>
}
