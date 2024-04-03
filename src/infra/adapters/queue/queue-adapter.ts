import { type Connection, type Channel, connect } from 'amqplib'
import { type QueueInterface } from '../contracts/queue'

export class RabbitMQAdapter implements QueueInterface {
  private connection: Connection
  private channel: Channel

  async connect (): Promise<void> {
    this.connection = await connect('')
    this.channel = await this.connection.createChannel()
  }

  async send (queueName: string, message: object): Promise<void> {
    await this.channel.assertQueue(queueName, { durable: true })
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
  }

  async consume (queueName: string, onMessage: (message: string) => void): Promise<void> {
    await this.channel.assertQueue(queueName, { durable: true })
    await this.channel.consume(queueName, msg => {
      if (msg) {
        onMessage(msg.content.toString())
      }
    }, { noAck: true })
  }
}
