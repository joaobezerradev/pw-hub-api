import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { environment } from '../../config/environment';
import { MailerInterface } from '../contracts';

export class MailerAdapter implements MailerInterface {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: environment.mailer.host,
      port: environment.mailer.port,
      secure: false,
      ignoreTLS: false,
      requireTLS: false,
      auth: {
        user: environment.mailer.user,
        pass: environment.mailer.pass,
      }
    }, { from: environment.mailer.from })
  }

  async send(to: string, subject: string, htmlContent: string): Promise<void> {
    const mailOptions: SendMailOptions = {
      from: environment.mailer.from,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
