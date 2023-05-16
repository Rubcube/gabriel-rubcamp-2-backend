import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { UUID } from 'common/seedword/domain/UUID'
import { IAccountRepository } from '../domain/account/IAccountRepository'

type Input = {
	account_id: string
}

type Output = Either<InvalidParameterError | ResourceNotFound, number>

@injectable()
export class BalanceService {
	constructor(
		@inject('AccountRepository')
		private readonly accountRepository: IAccountRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const account_id = UUID.createFrom({ value: input.account_id, field: 'account_id' })

		if (account_id.isLeft()) {
			return left(new InvalidParameterError([account_id.value]))
		}

		const balance = await this.accountRepository.findBalanceById(input.account_id)

		if (!balance) {
			return left(new ResourceNotFound())
		}

		return right(balance)
	}
}
