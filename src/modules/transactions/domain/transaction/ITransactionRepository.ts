import { UUID } from 'common/seedword/domain/UUID'
import { Transaction } from './Transaction'

export type ITransactionRepository = {
	findByAccountId: (accountId: UUID) => Promise<Transaction[] | null>
}
