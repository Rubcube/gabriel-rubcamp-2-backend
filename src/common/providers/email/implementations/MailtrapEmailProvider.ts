import fs from 'fs'
import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'

import { emailConfig } from 'config/email'

import { IEmailProvider, SendEmailInput } from '../IEmailProvider'

export class MailtrapEmailProvider implements IEmailProvider {
	private readonly client: Transporter

	constructor() {
		this.client = nodemailer.createTransport({
			host: emailConfig.drivers.mailtrap.host,
			port: emailConfig.drivers.mailtrap.port,
			auth: {
				user: emailConfig.drivers.mailtrap.auth.user,
				pass: emailConfig.drivers.mailtrap.auth.pass
			}
		})
	}

	async sendMail(data: SendEmailInput): Promise<void> {
		const templateFileContent = await fs.promises.readFile(data.templateData.file, {
			encoding: 'utf-8'
		})

		const template = handlebars.compile(templateFileContent)

		await this.client.sendMail({
			from: {
				name: emailConfig.defaults.from.name,
				address: emailConfig.defaults.from.email
			},
			to: {
				name: data.to.name,
				address: data.to.email
			},
			subject: data.subject,
			html: template(data.templateData.variables)
		})
	}
}
