import { type Either, right, left } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'

import { type User } from '../domain/user/User'
import { type IUserRepository } from '../domain/user/IUserRepository'
import { createUser } from '../domain/user/factories/createUser'

import { type Account } from 'modules/users/domain/account/Account'
import { type IAccountRepository } from 'modules/users/domain/account/IAccountRepository'
import { createAccount } from 'modules/users/domain/account/factories/createAccount'

interface Input {
	name: string
	email: string
	birthday: string
	phone: {
		country_code: string
		area_code: string
		number: string
	}
	document: string
	password: string
	transactional_password: string
	address: {
		zipcode: string
		city: string
		state: string
		street: string
		number: string
		complement: string
		neighborhood: string
	}
}

type Output = Either<InvalidOperationError | InvalidParameterError, { user: User; account: Account }>

export class CreateOnboardingService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly accountRepository: IAccountRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const documentAlreadyExists = await this.userRepository.documentExists(input.document)

		if (documentAlreadyExists) {
			return left(new InvalidOperationError())
		}

		const emailAlreadyExists = await this.userRepository.emailExists(input.document)

		if (emailAlreadyExists) {
			return left(new InvalidOperationError())
		}

		const phoneAlreadyExists = await this.userRepository.phoneExists(
			`${input.phone.country_code}${input.phone.area_code}${input.phone.number}`
		)

		if (phoneAlreadyExists) {
			return left(new InvalidOperationError())
		}

		const user = createUser({
			name: input.name,
			email: input.email,
			birthday: input.birthday,
			phone: {
				country_code: input.phone.country_code,
				area_code: input.phone.area_code,
				number: input.phone.number
			},
			document: input.document,
			password: {
				value: input.password,
				hashed: false
			},
			address: {
				zipcode: input.address.zipcode,
				city: input.address.city,
				state: input.address.state,
				street: input.address.street,
				number: input.address.number,
				complement: input.address.complement,
				neighborhood: input.address.neighborhood
			}
		})

		if (user.isLeft()) {
			return left(new InvalidParameterError(user.value))
		}

		const account = createAccount({
			user_id: user.value.id.value,
			transactional_password: input.transactional_password
		})

		if (account.isLeft()) {
			return left(new InvalidParameterError(account.value))
		}

		await this.userRepository.save(user.value)
		await this.accountRepository.save(account.value)

		return right({
			user: user.value,
			account: account.value
		})
	}
}
