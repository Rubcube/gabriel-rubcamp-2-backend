import { IEmailProvider, SendEmailInput } from '../IEmailProvider'

export class InMemoryEmailProvider implements IEmailProvider {
	async sendMail(data: SendEmailInput): Promise<void> {}
}
