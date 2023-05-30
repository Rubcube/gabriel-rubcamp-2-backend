export type EmailContact = {
	name: string
	email: string
}

export type TemplateDataVariabled = Record<string, string | number>

export type TemplateData = {
	file: string
	variables: TemplateDataVariabled
}

export type SendEmailInput = {
	to: EmailContact
	subject: string
	templateData: TemplateData
}

export type IEmailProvider = {
	sendMail: (data: SendEmailInput) => Promise<void>
}
