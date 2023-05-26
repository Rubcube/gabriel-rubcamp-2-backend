import { Either, left, combineLefts } from 'common/seedword/core/Either'
import { InternalTransfer } from '../InternalTransfer'

import { UUID } from 'common/seedword/domain/UUID'
import { Violation } from 'common/seedword/domain/Violation'
import { InternalTransferStatus, InternalTransferStatusEnum } from '../InternalTransferStatus'
import { Amount } from '../Amount'
import { ScheduledTo } from '../ScheduledTo'

type CreateInternalTransferProperties = {
	id: string
	sender_account_id: string
	recipient_account_id: string
	amount: number
	status: keyof typeof InternalTransferStatusEnum
	scheduled_to: string | null
	created_at?: Date
	updated_at?: Date
}

export function createInternalTransfer(
	properties: CreateInternalTransferProperties
): Either<Violation[], InternalTransfer> {
	const id = UUID.createFrom({ value: properties.id, field: 'id' })
	const sender_account_id = UUID.createFrom({ value: properties.sender_account_id, field: 'sender_account_id' })
	const recipient_account_id = UUID.createFrom({
		value: properties.recipient_account_id,
		field: 'recipient_account_id'
	})
	const amount = Amount.create({ value: properties.amount })
	const status = InternalTransferStatus.create(properties.status)
	const scheduled_to = properties.scheduled_to ? ScheduledTo.create(properties.scheduled_to) : null

	// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
	if (scheduled_to && scheduled_to.isLeft()) {
		return left([scheduled_to.value])
	}

	if (id.isLeft() || sender_account_id.isLeft() || recipient_account_id.isLeft() || amount.isLeft()) {
		return left(combineLefts(id, sender_account_id, recipient_account_id, amount))
	}

	return InternalTransfer.create(
		{
			sender_account_id: sender_account_id.value,
			recipient_account_id: recipient_account_id.value,
			amount: amount.value,
			status,
			scheduled_to: scheduled_to ? scheduled_to.value : null
		},
		id.value
	)
}
