import { inject, injectable } from 'tsyringe'
import { Either, left, right } from 'common/seedword/core/Either'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'

import { UUID } from 'common/seedword/domain/UUID'
import { Transaction } from '../domain/transaction/Transaction'
import { ITransactionRepository } from '../domain/transaction/ITransactionRepository'

type Input = {
	accountId: string
}

type Output = Either<InvalidParameterError, Transaction[]>

@injectable()
export class GetStatementService {
	constructor(@inject('TransactionRepository') private readonly transactionRepository: ITransactionRepository) {}

	async execute(input: Input): Promise<Output> {
		const accountId = UUID.createFrom({ value: input.accountId, field: 'account_id' })

		if (accountId.isLeft()) {
			return left(new InvalidParameterError([accountId.value]))
		}

		const transactions = await this.transactionRepository.findByAccountId(accountId.value)

		return right(transactions ?? [])
	}
}
