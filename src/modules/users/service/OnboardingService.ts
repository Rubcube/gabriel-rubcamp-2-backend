import { inject, injectable } from 'tsyringe'
import { Either, right, left, combineLefts } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'

import { User } from '../domain/user/User'
import { IUserRepository } from '../domain/user/IUserRepository'

import { Account } from 'modules/users/domain/account/Account'
import { TransactionalPassword } from '../domain/account/TransactionalPassword'

import { Name } from '../domain/user/Name'
import { Email } from '../domain/user/Email'
import { Birthday } from '../domain/user/Birthday'
import { Phone } from '../domain/user/Phone'
import { Document } from '../domain/user/Document'
import { Password } from '../domain/user/Password'
import { Address } from '../domain/user/Address'

type Input = {
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

type Output = Either<InvalidParameterError | InvalidOperationError, null>

@injectable()
export class CreateOnboardingService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const name = Name.create(input.name)
		const email = Email.create(input.email)
		const birthday = Birthday.create(input.birthday)
		const phone = Phone.create({
			country_code: input.phone.country_code,
			area_code: input.phone.area_code,
			number: input.phone.number
		})
		const document = Document.create(input.document)
		const password = Password.create(input.password, false)

		const transactional_password = TransactionalPassword.create(input.transactional_password)

		const address = Address.create(input.address)

		if (
			name.isLeft() ||
			email.isLeft() ||
			birthday.isLeft() ||
			phone.isLeft() ||
			document.isLeft() ||
			password.isLeft() ||
			transactional_password.isLeft() ||
			address.isLeft()
		) {
			return left(
				new InvalidParameterError(
					combineLefts(name, email, birthday, phone, document, password, transactional_password, address)
				)
			)
		}

		const documentAlreadyExists = await this.userRepository.documentExists(input.document)
		if (documentAlreadyExists) {
			return left(new InvalidOperationError())
		}

		const emailAlreadyExists = await this.userRepository.emailExists(input.document)
		if (emailAlreadyExists) {
			return left(new InvalidOperationError())
		}

		const phoneAlreadyExists = await this.userRepository.phoneExists({
			country_code: input.phone.country_code,
			area_code: input.phone.area_code,
			number: input.phone.number
		})
		if (phoneAlreadyExists) {
			return left(new InvalidOperationError())
		}

		const user = User.createNew({
			name: name.value,
			email: email.value,
			birthday: birthday.value,
			phone: phone.value,
			document: document.value,
			password: password.value,
			address: address.value
		})

		const account = Account.createNew({
			user_id: user.id,
			transactional_password: transactional_password.value
		})

		await this.userRepository.create(user, account)

		return right(null)
	}
}
