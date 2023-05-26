import moment from 'moment'
import { z } from 'zod'
import { inject, injectable } from 'tsyringe'
import { combineLefts, Either, left, right } from 'common/seedword/core/Either'
import { DateValueObject } from 'common/domain/DateValueObject'

import { UUID } from 'common/seedword/domain/UUID'
import { PaginationValueObject } from 'common/domain/PaginationValueObject'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'
import { ChoicesViolation } from 'common/domain/violations/ChoicesViolation'

import { Transaction } from '../domain/transaction/Transaction'
import { ITransactionRepository } from '../domain/transaction/ITransactionRepository'

import { IAccountRepository } from 'modules/identity/domain/account/IAccountRepository'

type Input = {
	accountId: string
	page?: number
	count?: number
	type?: string
	createdSince?: string
	createdUntil?: string
}

type Output = Either<InvalidParameterError, Transaction[]>

@injectable()
export class GetStatementService {
	constructor(
		@inject('TransactionRepository')
		private readonly transactionRepository: ITransactionRepository,
		@inject('AccountRepository')
		private readonly accountRepository: IAccountRepository
	) {}

	async execute(input: Input): Promise<Output> {
		const accountId = UUID.createFrom({ value: input.accountId, field: 'account_id' })

		if (accountId.isLeft()) {
			return left(new InvalidParameterError([accountId.value]))
		}

		const account = await this.accountRepository.findById(accountId.value.value)

		if (!account) {
			return left(new ResourceNotFound())
		}

		let page = 1
		let count = 10

		if (input.page !== undefined || input.count !== undefined) {
			const pagination = PaginationValueObject.create({ page: input.page, count: input.count })

			if (pagination.isLeft()) {
				return left(new InvalidParameterError(pagination.value))
			}

			page = pagination.value.page
			count = pagination.value.count
		}

		let type: 'all' | 'in' | 'out' | 'future' = 'all'

		if (input.type !== undefined) {
			const typeGuard = z.enum(['in', 'out', 'future', 'all'])

			if (!typeGuard.safeParse(input.type).success) {
				return left(new InvalidParameterError([new ChoicesViolation('type', input.type, typeGuard.options)]))
			}

			type = typeGuard.parse(input.type)
		}

		let createdSince: DateValueObject | undefined
		let createdUntil: DateValueObject | undefined

		if (input.createdSince !== undefined || input.createdUntil !== undefined) {
			const since = DateValueObject.create({ value: input.createdSince as string, field: 'created_since' })
			const until = DateValueObject.create({ value: input.createdUntil as string, field: 'created_until' })

			if (since.isLeft() || until.isLeft()) {
				return left(new InvalidParameterError(combineLefts(since, until)))
			}

			const sinceMoment = moment(since.value.value)
			const untilMoment = moment(until.value.value)

			if (sinceMoment.isSameOrAfter(moment().startOf('day'))) {
				return left(new InvalidParameterError())
			}

			if (untilMoment.isSameOrAfter(moment().startOf('day'))) {
				return left(new InvalidParameterError())
			}

			if (untilMoment.isAfter(sinceMoment)) {
				return left(new InvalidParameterError())
			}

			createdSince = since.value
			createdUntil = until.value
		}

		const transactions = await this.transactionRepository.findByAccountId(
			accountId.value,
			page,
			count,
			type,
			createdSince,
			createdUntil
		)

		return right(transactions ?? [])
	}
}
