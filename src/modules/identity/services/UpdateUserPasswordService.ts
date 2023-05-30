import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { UUID } from 'common/seedword/domain/UUID'

import { IUserRepository } from '../domain/user/IUserRepository'

type Input = {
	userId: string
	oldPassword: string
	password: string
}

type Output = Either<AppError, null>

@injectable()
export class UpdateUserPasswordService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const userId = UUID.createFrom({ value: input.userId, field: 'user_id' })

		if (userId.isLeft()) {
			return left(new InvalidParameterError([userId.value]))
		}

		const user = await this.userRepository.findById(userId.value.value)

		if (user === null) {
			return left(new ResourceNotFound())
		}

		const changePasswordResult = await user.changePassword(input.oldPassword, input.password)

		if (changePasswordResult.isLeft()) {
			return left(new InvalidParameterError([changePasswordResult.value]))
		}

		await this.userRepository.updatePassword(user)

		return right(null)
	}
}
