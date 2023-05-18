import { Either, right } from 'common/seedword/core/Either'
import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'
import { Violation } from 'common/seedword/domain/Violation'

import { UUID } from 'common/seedword/domain/UUID'

import { Amount } from './Amount'
import { InternalTransferStatus } from './InternalTransferStatus'
import { ScheduledTo } from './ScheduledTo'

type InternalTransferProperties = {
	sender_account_id: UUID
	recipient_account_id: UUID
	amount: Amount
	status: InternalTransferStatus
	scheduled_to: ScheduledTo | null
	created_at?: Date
	updated_at?: Date
}

export class InternalTransfer extends AggregateRoot<InternalTransferProperties> {
	static create(properties: InternalTransferProperties): Either<Violation[], InternalTransfer> {
		return right(new InternalTransfer(properties))
	}

	static createNew(properties: InternalTransferProperties): Either<Violation[], InternalTransfer> {
		return right(
			new InternalTransfer({
				...properties,
				amount: properties.amount,
				status: properties.status
			})
		)
	}
}
