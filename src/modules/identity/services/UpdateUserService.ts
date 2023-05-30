import { inject, injectable } from 'tsyringe'
import { combineLefts, Either, left, right } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { UUID } from 'common/seedword/domain/UUID'

import { User } from '../domain/user/User'
import { IUserRepository } from '../domain/user/IUserRepository'

import { Name } from '../domain/user/Name'
import { Email } from '../domain/user/Email'
import { Birthday } from '../domain/user/Birthday'
import { Phone } from '../domain/user/Phone'
import { Address } from '../domain/user/Address'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'

type Input = {
	id: string
	name: string
	email: string
	birthday: string
	phone: {
		country_code: string
		area_code: string
		number: string
	}
	document: string
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

type Output = Either<AppError, User>

@injectable()
export class UpdateUserService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const userId = UUID.createFrom({ value: input.id, field: 'user_id' })

		if (userId.isLeft()) {
			return left(new InvalidParameterError([userId.value]))
		}

		const data = await this.userRepository.findByIdWithAccount(userId.value.value)

		if (data === null) {
			return left(new ResourceNotFound())
		}

		const user = data.user
		const account = data.account

		const name = Name.create(input.name)
		const email = Email.create(input.email)
		const birthday = Birthday.create(input.birthday)
		const phone = Phone.create(input.phone)

		const address = Address.create(input.address)

		if (name.isLeft() || email.isLeft() || birthday.isLeft() || phone.isLeft() || address.isLeft()) {
			return left(new InvalidParameterError(combineLefts(name, email, birthday, phone, address)))
		}

		if (!email.value.equals(user.email)) {
			const emailAlreadyExists = await this.userRepository.emailExists(input.document)

			if (emailAlreadyExists) {
				return left(new InvalidOperationError())
			}

			user.isEmailVerified = false
			account.statusToPendingVerification()
		}

		if (!phone.value.equals(user.phone)) {
			const phoneAlreadyExists = await this.userRepository.phoneExists(input.phone)

			if (phoneAlreadyExists) {
				return left(new InvalidOperationError())
			}

			user.isPhoneVerified = false
			account.statusToPendingVerification()
		}

		user.name = name.value
		user.email = email.value
		user.birthday = birthday.value
		user.phone = phone.value
		user.address = address.value

		await this.userRepository.save(user, account)

		return right(user)
	}
}
