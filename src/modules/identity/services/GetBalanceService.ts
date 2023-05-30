import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { AppError } from 'common/seedword/errors/AppError'
import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { UUID } from 'common/seedword/domain/UUID'
import { IAccountRepository } from '../domain/account/IAccountRepository'

type Input = {
	accountId: string
}

type Output = Either<AppError, number>

@injectable()
export class GetBalanceService {
	constructor(
		@inject('AccountRepository')
		private readonly accountRepository: IAccountRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const accountId = UUID.createFrom({ value: input.accountId, field: 'account_id' })

		if (accountId.isLeft()) {
			return left(new InvalidParameterError([accountId.value]))
		}

		const balance = await this.accountRepository.findBalanceById(input.accountId)

		if (balance === null) {
			return left(new ResourceNotFound())
		}

		return right(balance)
	}
}
