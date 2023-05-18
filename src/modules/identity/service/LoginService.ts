import { inject, injectable } from 'tsyringe'
import { Either, right, left, combineLefts } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
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

type Output = Either<
	InvalidParameterError | ResourceNotFound,
	{
		token: string
	}
>

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

		const isPasswordCorrect = await user.props.password.comparePassword(input.password)
		if (!isPasswordCorrect) {
			return left(new InvalidParameterError())
		}

		const account = await this.accountRepository.findByUserId(user.id.value)
		if (!account) {
			return left(new ResourceNotFound())
		}

		const token = this.tokenProvider.signUserToken(user, account)

		return right({
			token
		})
	}
}
