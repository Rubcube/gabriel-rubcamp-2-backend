import { Account } from 'modules/identity/domain/account/Account'
import { InternalTransfer } from './InternalTransfer'

export type IInternalTransferRepository = {
	create: (internalTransfer: InternalTransfer, senderAccount: Account, recipientAccount: Account) => Promise<void>
}
