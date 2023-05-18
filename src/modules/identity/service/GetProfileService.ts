import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { UUID } from 'common/seedword/domain/UUID'

import { User } from '../domain/user/User'
import { IUserRepository } from '../domain/user/IUserRepository'

import { Account } from '../domain/account/Account'

type Input = {
	user_id: string
}

type Output = Either<InvalidParameterError | ResourceNotFound, { user: User; account: Account }>

@injectable()
export class GetProfileService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const user_id = UUID.createFrom({ value: input.user_id, field: 'user_id' })

		if (user_id.isLeft()) {
			return left(new InvalidParameterError([user_id.value]))
		}

		const result = await this.userRepository.findByIdWithAccount(user_id.value.value)

		if (result === null) {
			return left(new ResourceNotFound())
		}

		return right(result)
	}
}
