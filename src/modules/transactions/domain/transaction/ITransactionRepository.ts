import { DateValueObject } from 'common/domain/DateValueObject'
import { UUID } from 'common/seedword/domain/UUID'
import { Transaction } from './Transaction'

export type ITransactionRepository = {
	findByAccountId: (
		accountId: UUID,
		page: number,
		count: number,
		type: 'in' | 'out' | 'future' | 'all',
		createdSince?: DateValueObject,
		createdUntil?: DateValueObject
	) => Promise<Transaction[] | null>
}
