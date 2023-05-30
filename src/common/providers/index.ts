import { container } from 'tsyringe'

import { ITokenProvider } from './token/ITokenProvider'
import { IVerificationProvider } from './verification/IVerificationProvider'
import { IEmailProvider } from './email/IEmailProvider'

import { TokenProvider } from './token/implementations/TokenProvider'
import { VerificationProvider } from './verification'
import { MailtrapEmailProvider } from './email/implementations/MailtrapEmailProvider'

container.registerSingleton<ITokenProvider>('TokenProvider', TokenProvider)

container.registerSingleton<IVerificationProvider>('VerificationProvider', VerificationProvider)

container.registerSingleton<IEmailProvider>('EmailProvider', MailtrapEmailProvider)
