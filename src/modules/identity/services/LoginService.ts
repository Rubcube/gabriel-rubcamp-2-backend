import { inject, injectable } from 'tsyringe'
import { Either, right, left, combineLefts } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { BlockedAccountError } from 'common/errors/BlockedAccountError'
import { ClosedAccountError } from 'common/errors/ClosedAccountError'
import { LockedAccountError } from 'common/errors/LockedAccountError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { IUserRepository } from '../domain/user/IUserRepository'
import { IAccountRepository } from '../domain/account/IAccountRepository'
import { ITokenProvider } from 'common/providers/token/ITokenProvider'

import { Document } from '../domain/user/Document'
import { Password } from '../domain/user/Password'

type Input = {
	document: string
	password: string
}

type Output = Either<AppError, { token: string }>

@injectable()
export class LoginService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository,
		@inject('AccountRepository')
		private readonly accountRepository: IAccountRepository,
		@inject('TokenProvider')
		private readonly tokenProvider: ITokenProvider
	) {}

	async execute(input: Input): Promise<Output> {
		const document = Document.create(input.document)
		const password = Password.create(input.password, false)

		if (document.isLeft() || password.isLeft()) {
			return left(new InvalidParameterError(combineLefts(document, password)))
		}

		const user = await this.userRepository.findByDocument(input.document)

		if (!user) {
			return left(new InvalidParameterError())
		}

		const account = await this.accountRepository.findByUserId(user.id.value)

		if (!account) {
			return left(new ResourceNotFound())
		}

		if (account.isBlocked()) {
			return left(new BlockedAccountError())
		}

		if (account.isClosed()) {
			return left(new ClosedAccountError())
		}

		if (account.isLocked()) {
			return left(new LockedAccountError())
		}

		const isPasswordCorrect = await user.props.password.comparePassword(input.password)

		if (!isPasswordCorrect) {
			account.addLoginAttempt()

			await this.accountRepository.addLoginAttempt(account)

			return left(new InvalidParameterError())
		}

		account.login()

		await this.accountRepository.login(account)

		const token = this.tokenProvider.signUserToken(user, account)

		return right({ token })
	}
}
