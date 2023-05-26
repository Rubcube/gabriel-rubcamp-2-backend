import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'

import { InternalError } from 'common/errors/InternalError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'

import { IUserRepository } from '../domain/user/IUserRepository'
import { AccountStatusEnum } from '../domain/account/AccountStatus'
import { IVerificationProvider } from 'common/providers/verification_provider/IVerificationProvider'
import moment from 'moment'

type Input = {
	userId: string
}

type Output = Either<AppError, null>

@injectable()
export class LoginService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository,
		private readonly verificationProvider: IVerificationProvider
	) {}

	async execute(input: Input): Promise<Output> {
		const data = await this.userRepository.findByIdWithAccount(input.userId)

		if (!data?.user || !data?.account) {
			return left(new ResourceNotFound())
		}

		if (data.account.props.status.props.value !== AccountStatusEnum.PENDING_VERIFICATION) {
			return left(new InvalidOperationError())
		}

		if (data.user.isVerified || data.user.isPhoneVerified) {
			return left(new InvalidOperationError())
		}

		if (data.user.verificationAttempts > 0) {
			switch (data.user.verificationAttempts) {
				case 1:
					if (moment().isSameOrBefore(data.user.lastVerificationTry)) break

				default:
					break
			}
		}

		const result = await this.verificationProvider.sendVerification({
			to: data.user.email.value,
			channel: 'email',
			substitutions: {
				name: data.user.name.value
			}
		})

		if (!result) {
			return left(new InternalError())
		}

		return right(null)
	}
}
