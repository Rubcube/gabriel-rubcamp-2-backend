import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { UUID } from 'common/seedword/domain/UUID'

import { User } from '../domain/user/User'
import { IUserRepository } from '../domain/user/IUserRepository'

import { Account } from '../domain/account/Account'

type Input = {
	userId: string
}

type Output = Either<AppError, { user: User; account: Account }>

@injectable()
export class GetProfileService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const userId = UUID.createFrom({ value: input.userId, field: 'user_id' })

		if (userId.isLeft()) {
			return left(new InvalidParameterError([userId.value]))
		}

		const result = await this.userRepository.findByIdWithAccount(userId.value.value)

		if (result === null) {
			return left(new ResourceNotFound())
		}

		return right(result)
	}
}
