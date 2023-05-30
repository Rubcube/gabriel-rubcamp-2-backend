import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'

import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'
import { InvalidOperationError } from 'common/errors/InvalidOperationError'
import { VerificationProviderError } from 'common/errors/VerificationProviderError'
import { MaxVerificationAttemptsError } from 'common/errors/MaxVerificationAttemptsError'

import { IUserRepository } from '../domain/user/IUserRepository'
import { IVerificationProvider } from 'common/providers/verification/IVerificationProvider'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ChoicesViolation } from 'common/domain/violations/ChoicesViolation'

type Input = {
	userId: string
	channel: string
}

type Output = Either<AppError, null>

@injectable()
export class SendVerificationCodeService {
	constructor(
		@inject('UserRepository')
		private readonly userRepository: IUserRepository,
		@inject('VerificationProvider')
		private readonly verificationProvider: IVerificationProvider
	) {}

	async execute(input: Input): Promise<Output> {
		const channelTypeGuard = z.enum(['phone', 'email'])
		const parsedChannelTypeGuard = channelTypeGuard.safeParse(input.channel)

		if (!parsedChannelTypeGuard.success) {
			return left(new InvalidParameterError([new ChoicesViolation('channel', input.channel, channelTypeGuard.options)]))
		}

		const channel = parsedChannelTypeGuard.data

		const data = await this.userRepository.findByIdWithAccount(input.userId)

		if (!data?.user || !data?.account) {
			return left(new ResourceNotFound())
		}

		if (channel === 'phone' && data.user.isPhoneVerified) {
			return left(new InvalidOperationError())
		}

		if (channel === 'email' && data.user.isEmailVerified) {
			return left(new InvalidOperationError())
		}

		if (!data.user.tryAddVerificationAttempt()) {
			return left(new MaxVerificationAttemptsError(data.user.retryVerificationAfter()))
		}

		const result = await this.verificationProvider.sendVerification({
			to: channel === 'email' ? data.user.email.value : `+${data.user.phone.parsed}`,
			channel,
			substitutions: {
				name: data.user.name.value
			}
		})

		if (!result) {
			return left(new VerificationProviderError())
		}

		await this.userRepository.addVerificationAttempt(data.user)

		return right(null)
	}
}
