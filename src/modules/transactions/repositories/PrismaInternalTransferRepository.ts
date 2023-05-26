import prisma from 'infrastructure/prisma/client'
import { UUID } from 'common/seedword/domain/UUID'
import { Account } from 'modules/identity/domain/account/Account'

import { IInternalTransferRepository } from '../domain/internal_transfer/IInternalTransferRepository'
import { InternalTransfer } from '../domain/internal_transfer/InternalTransfer'
import { InternalTransferMapper } from '../mappers/InternalTransferMapper'

export class PrismaInternalTransferRepository implements IInternalTransferRepository {
	async getById(id: UUID): Promise<InternalTransfer | null> {
		const internalTranfer = await prisma.internalTransfer.findUnique({
			where: {
				id: id.value
			}
		})

		return internalTranfer ? InternalTransferMapper.toDomain(internalTranfer) : null
	}

	async create(internalTransfer: InternalTransfer, senderAccount: Account, recipientAccount: Account): Promise<void> {
		await prisma.$transaction([
			prisma.account.update({
				where: {
					id: senderAccount.id.value
				},
				data: {
					balance: senderAccount.props.balance
				}
			}),
			prisma.account.update({
				where: {
					id: recipientAccount.id.value
				},
				data: {
					balance: recipientAccount.props.balance
				}
			}),
			prisma.internalTransfer.create({
				data: {
					id: internalTransfer.id.value,
					sender_account_id: internalTransfer.props.sender_account_id.value,
					recipient_account_id: internalTransfer.props.recipient_account_id.value,
					amount: internalTransfer.props.amount.props.value,
					status: internalTransfer.props.status.props.value,
					scheduled_to: internalTransfer.props.scheduled_to ? new Date(internalTransfer.props.scheduled_to.value) : null
				}
			})
		])
	}
}
