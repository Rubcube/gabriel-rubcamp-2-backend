import { InternalTransfer } from '../domain/internal_transfer/InternalTransfer'
import { InternalTranferDTO } from '../dtos/InternalTransferDTO'

export class InternalTransferMapper {
	static toDTO(internalTranfer: InternalTransfer): InternalTranferDTO {
		return {
			id: internalTranfer.id.value,
			sender_account_id: internalTranfer.props.sender_account_id.value,
			recipient_account_id: internalTranfer.props.recipient_account_id.value,
			amount: internalTranfer.props.amount.props.value,
			status: internalTranfer.props.status.props.value,
			scheduled_to: internalTranfer.props.scheduled_to?.toString() ?? null,
			created_at: internalTranfer.props.created_at?.toString(),
			updated_at: internalTranfer.props.updated_at?.toString()
		}
	}
}
