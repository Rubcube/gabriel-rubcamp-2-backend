import { prisma } from 'infrastructure/prisma/client'
import { UUID } from 'common/seedword/domain/UUID'

import { ITransactionRepository } from '../domain/transaction/ITransactionRepository'
import { Transaction } from '../domain/transaction/Transaction'
import { TransactionType, TransactionTypeEnum } from '../domain/transaction/TransactionType'
import { TransactionStatus, TransactionStatusEnum } from '../domain/transaction/TransactionStatus'

export class PrismaTransactionRepository implements ITransactionRepository {
	async findByAccountId(accountId: UUID): Promise<Transaction[] | null> {
		const transaction = await prisma.account.findUnique({
			where: {
				id: accountId.value
			},
			select: {
				sended_internal_transfers: true,
				recipient_internal_transfers: true
			}
		})

		const s = transaction?.sended_internal_transfers.map(transfer => {
			const source_id = UUID.createFrom({ value: transfer.id, field: 'source_id' })

			if (source_id.isLeft()) throw new Error('Error on PrismaTransactionRepository.findByAccountId()')

			const transaction = Transaction.create({
				source_id: source_id.value,
				type: TransactionType.create({
					value:
						accountId.value === transfer.sender_account_id
							? TransactionTypeEnum.TRANSFER_OUTBOUND
							: TransactionTypeEnum.TRANSFER_INBOUND
				}),
				status: TransactionStatus.create({
					value:
						transfer.status === 'COMPLETED'
							? TransactionStatusEnum.POSTED
							: transfer.status === 'SCHEDULED'
							? TransactionStatusEnum.OPEN
							: TransactionStatusEnum.VOID
				}),
				created_at: transfer.created_at
			})

			if (transaction.isLeft()) throw new Error('Error on PrismaTransactionRepository.findByAccountId()')

			return transaction.value
		})

		const r = transaction?.recipient_internal_transfers.map(transfer => {
			const source_id = UUID.createFrom({ value: transfer.id, field: 'source_id' })

			if (source_id.isLeft()) throw new Error('Error on PrismaTransactionRepository.findByAccountId()')

			const transaction = Transaction.create({
				source_id: source_id.value,
				type: TransactionType.create({
					value:
						accountId.value === transfer.sender_account_id
							? TransactionTypeEnum.TRANSFER_OUTBOUND
							: TransactionTypeEnum.TRANSFER_INBOUND
				}),
				status: TransactionStatus.create({
					value:
						transfer.status === 'COMPLETED'
							? TransactionStatusEnum.POSTED
							: transfer.status === 'SCHEDULED'
							? TransactionStatusEnum.OPEN
							: TransactionStatusEnum.VOID
				}),
				created_at: transfer.created_at
			})

			if (transaction.isLeft()) throw new Error('Error on PrismaTransactionRepository.findByAccountId()')

			return transaction.value
		})

		return s?.concat(r ?? []) ?? null
	}
}
