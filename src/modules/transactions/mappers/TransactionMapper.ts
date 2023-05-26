import { Transaction } from '../domain/transaction/Transaction'
import { TransactionDTO } from '../dtos/TransactionDTO'

export class TransactionMapper {
	static toDTO(transaction: Transaction): TransactionDTO {
		return {
			status: transaction.props.status.props.value,
			type: transaction.props.type.props.value,
			source_id: transaction.props.source_id,
			amount: transaction.props.amount,
			created_at: transaction.props.created_at?.toString()
		}
	}
}
