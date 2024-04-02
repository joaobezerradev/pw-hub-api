export interface QueueInterface {
  send(queueName: string, message: string): Promise<void>;
  consume(queueName: string, onMessage: (message: string) => void): Promise<void>;
}
