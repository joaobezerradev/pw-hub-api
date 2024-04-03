export interface QueueInterface {
  send: (queueName: string, message: object) => Promise<void>
  consume: (queueName: string, onMessage: (message: string) => void) => Promise<void>
}
