import { Either, right } from 'common/seedword/core/Either'
import { ValueObject } from 'common/seedword/domain/ValueObject'
import { UUID } from 'common/seedword/domain/UUID'
import { Violation } from 'common/seedword/domain/Violation'

import { TransactionStatus } from './TransactionStatus'
import { TransactionType } from './TransactionType'

type TransactionProperties = {
	status: TransactionStatus
	type: TransactionType
	source_id: UUID
	created_at?: Date
}

export class Transaction extends ValueObject<TransactionProperties> {
	static create(properties: TransactionProperties): Either<Violation[], Transaction> {
		return right(new Transaction(properties))
	}
}
