import { Either, right } from 'common/seedword/core/Either'
import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Violation } from 'common/seedword/domain/Violation'

import { TransactionStatus } from './TransactionStatus'
import { TransactionType } from './TransactionType'

type TransactionProperties = {
	status: TransactionStatus
	type: TransactionType
	source_id: string
	amount: number
	created_at?: Date
}

export class Transaction extends ValueObject<TransactionProperties> {
	static create(properties: TransactionProperties): Either<Violation[], Transaction> {
		return right(new Transaction(properties))
	}
}
