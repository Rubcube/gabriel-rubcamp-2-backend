import { emailConfig } from 'config/email'

import { MailtrapEmailProvider } from './implementations/MailtrapEmailProvider'

const implementations = {
	mailtrap: MailtrapEmailProvider
}

export const EmailProvider = implementations[emailConfig.driver]
