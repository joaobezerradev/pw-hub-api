export interface MailerInterface {
  send(to: string, subject: string, htmlContent: string): Promise<void>
}