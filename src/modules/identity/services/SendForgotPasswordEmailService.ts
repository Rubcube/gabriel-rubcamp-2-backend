import path from 'path'
import { inject, injectable } from 'tsyringe'
import { Either, right, left } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'

import { IUserRepository } from '../domain/user/IUserRepository'
import { IEmailProvider } from 'common/providers/email/IEmailProvider'
import { ITokenProvider } from 'common/providers/token/ITokenProvider'

import { Document } from '../domain/user/Document'

type Input = {
	document: string
}

type Output = Either<AppError, null>

@injectable()
export class SendForgotPasswordEmailService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository,
		@inject('EmailProvider')
		private readonly emailProvider: IEmailProvider,
		@inject('TokenProvider')
		private readonly tokenProvider: ITokenProvider
	) {}

	async execute(input: Input): Promise<Output> {
		const document = Document.create(input.document)

		if (document.isLeft()) {
			return left(new InvalidParameterError([document.value]))
		}

		const user = await this.userRepository.findByDocument(input.document)

		if (!user) {
			return left(new ResourceNotFound())
		}

		if (!user.isEmailVerified) {
			return left(new InvalidOperationError())
		}

		const token = this.tokenProvider.signUserResetToken(user)

		const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

		await this.emailProvider.sendMail({
			to: {
				name: user.name.value,
				email: user.email.value
			},
			subject: 'Link para alteração da sua senha do RubBank',
			templateData: {
				file: forgotPasswordTemplate,
				variables: {
					name: user.name.value,
					link: `${String(process.env.RESET_TOKEN_URL)}?token=${token}`
				}
			}
		})

		return right(null)
	}
}
