import { type Either, right, left } from 'common/seedword/core/Either'
import { Guard } from 'common/seedword/core/Guard'

import { type Account } from '../domain/account/Account'
import { type User } from '../domain/user/User'

import { type IUserRepository } from '../domain/user/IUserRepository'
import { type IAccountRepository } from '../domain/account/IAccountRepository'
import { type ITokenProvider } from 'common/providers/ITokenProvider'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'

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
		const null_undefined_guard = Guard.againstNullOrUndefinedBulk([
			{
				field: 'document',
				value: input.document
			},
			{
				field: 'password',
				value: input.password
			}
		])

		if (null_undefined_guard.fail) {
			return left(new InvalidParameterError(null_undefined_guard.fields.map(field => new RequiredViolation(field))))
		}

		const type_guard = Guard.isOfTypeBulk('string', [
			{
				field: 'document',
				value: input.document
			},
			{
				field: 'password',
				value: input.password
			}
		])

		if (type_guard.fail) {
			return left(new InvalidParameterError(type_guard.fields.map(field => new WrongTypeViolation(field))))
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
