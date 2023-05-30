type EmailConfig = {
	driver: 'mailtrap'

	drivers: Record<
		'mailtrap',
		{
			host: string
			port: number
			auth: {
				user: string
				pass: string
			}
		}
	>

	defaults: {
		from: {
			email: string
			name: string
		}
	}
}

export const emailConfig: EmailConfig = {
	driver: 'mailtrap',

	drivers: {
		mailtrap: {
			host: 'sandbox.smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: String(process.env.MAILTRAP_USER),
				pass: String(process.env.MAILTRAP_PASS)
			}
		}
	},

	defaults: {
		from: {
			email: 'ogabrielribeirof@gmail.com',
			name: 'RubBank'
		}
	}
}
