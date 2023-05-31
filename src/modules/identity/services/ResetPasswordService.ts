import { inject, injectable } from 'tsyringe'
import { Either, right, left } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { IUserRepository } from '../domain/user/IUserRepository'

import { Password } from '../domain/user/Password'
import { ITokenProvider } from 'common/providers/token/ITokenProvider'

type Input = {
	token: string
	password: string
}

type Output = Either<AppError, null>

@injectable()
export class ResetPasswordService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository,
		@inject('TokenProvider')
		private readonly tokenProvider: ITokenProvider
	) {}

	async execute(input: Input): Promise<Output> {
		const password = Password.create(input.password, false)

		if (password.isLeft()) {
			return left(new InvalidParameterError([password.value]))
		}

		const result = this.tokenProvider.decodeResetToken(input.token)

		if (result.isLeft()) {
			return left(result.value)
		}

		const user = await this.userRepository.findById(result.value.subject)

		if (!user) {
			return left(new ResourceNotFound())
		}

		user.resetPassword(password.value)

		await this.userRepository.updatePassword(user)

		return right(null)
	}
}
