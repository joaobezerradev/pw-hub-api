export class HttpException extends Error {
  readonly code: number
  readonly message: string

  constructor(message: string, code: number) {
    super()
    this.message = message
    this.code = code
  }
}