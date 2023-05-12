import { type Either, right, left, combineLefts } from 'src/common/seedword/core/Either'

import { InvalidParameterError } from 'src/common/errors/InvalidParameterError'
import { ResourceNotFound } from 'src/common/errors/ResourceNotFoundError'

import { type User } from '../domain/user/User'
import { type IUserRepository } from '../domain/user/IUserRepository'
import { type Account } from '../domain/account/Account'
import { type IAccountRepository } from '../domain/account/IAccountRepository'

import { type ITokenProvider } from 'src/common/providers/ITokenProvider'

import { Document } from '../domain/user/Document'
import { Password } from '../domain/user/Password'

interface Input {
	document: string
	password: string
}

type Output = Either<
	InvalidParameterError | ResourceNotFound,
	{
		user: User
		account: Account
		token: string
	}
>

export class AuthenticateService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly accountRepository: IAccountRepository,
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

		const token = this.tokenProvider.signUserToken(user)

		return right({
			user,
			account,
			token
		})
	}
}
