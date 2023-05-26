import { InternalTransfer as PrismaInternalTransfer } from '@prisma/client'
import moment from 'moment'
import { createInternalTransfer } from '../domain/internal_transfer/factories/createInternalTransfer'

import { InternalTransfer } from '../domain/internal_transfer/InternalTransfer'
import { InternalTranferDTO } from '../dtos/InternalTransferDTO'

export class InternalTransferMapper {
	static toDomain(payload: PrismaInternalTransfer): InternalTransfer {
		const internalTransfer = createInternalTransfer({
			id: payload.id,
			sender_account_id: payload.sender_account_id,
			recipient_account_id: payload.recipient_account_id,
			amount: payload.amount,
			status: payload.status,
			scheduled_to: payload.scheduled_to ? moment(payload.scheduled_to).format('YYYY-MM-DD') : null,
			created_at: payload.created_at,
			updated_at: payload.updated_at
		})

		if (internalTransfer.isLeft()) throw new Error('Error on InternalTransferMapper.toDomain()')

		return internalTransfer.value
	}

	static toDTO(internalTranfer: InternalTransfer): InternalTranferDTO {
		return {
			id: internalTranfer.id.value,
			sender_account_id: internalTranfer.props.sender_account_id.value,
			recipient_account_id: internalTranfer.props.recipient_account_id.value,
			amount: internalTranfer.props.amount.props.value,
			status: internalTranfer.props.status.props.value,
			scheduled_to: internalTranfer.props.scheduled_to?.value.toString() ?? null,
			created_at: internalTranfer.props.created_at?.toString(),
			updated_at: internalTranfer.props.updated_at?.toString()
		}
	}
}
