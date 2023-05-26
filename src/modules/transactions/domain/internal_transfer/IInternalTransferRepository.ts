import { UUID } from 'common/seedword/domain/UUID'

import { InternalTransfer } from './InternalTransfer'
import { Account } from 'modules/identity/domain/account/Account'

export type IInternalTransferRepository = {
	getById: (id: UUID) => Promise<InternalTransfer | null>
	create: (internalTransfer: InternalTransfer, senderAccount: Account, recipientAccount: Account) => Promise<void>
}
