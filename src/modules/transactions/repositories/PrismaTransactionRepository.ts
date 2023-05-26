import { Prisma } from '@prisma/client'

import prisma from 'infrastructure/prisma/client'
import { UUID } from 'common/seedword/domain/UUID'

import { ITransactionRepository } from '../domain/transaction/ITransactionRepository'
import { Transaction } from '../domain/transaction/Transaction'
import { TransactionType, TransactionTypeEnum } from '../domain/transaction/TransactionType'
import { TransactionStatus, TransactionStatusEnum } from '../domain/transaction/TransactionStatus'

import { DateValueObject } from 'common/domain/DateValueObject'

const WHERE_IN = (accountId: string): Prisma.InternalTransferWhereInput => ({
	OR: [
		{
			status: 'COMPLETED',
			recipient_account_id: accountId
		},
		{
			status: 'REFUNDED',
			sender_account_id: accountId
		}
	]
})

const WHERE_OUT = (accountId: string): Prisma.InternalTransferWhereInput => ({
	OR: [
		{
			status: 'COMPLETED',
			sender_account_id: accountId
		},
		{
			status: 'REFUNDED',
			recipient_account_id: accountId
		}
	]
})

const WHERE_ALL = (accountId: string): Prisma.InternalTransferWhereInput => ({
	OR: [
		{
			sender_account_id: accountId
		},
		{
			recipient_account_id: accountId
		}
	]
})

const WHERE_FUTURE = (accountId: string): Prisma.InternalTransferWhereInput => ({
	status: 'SCHEDULED',
	sender_account_id: accountId
})

export class PrismaTransactionRepository implements ITransactionRepository {
	async findByAccountId(
		accountId: UUID,
		page: number,
		count: number,
		type: 'in' | 'out' | 'future' | 'all',
		createdSince?: DateValueObject,
		createdUntil?: DateValueObject
	): Promise<Transaction[] | null> {
		const internalTransfers = await prisma.internalTransfer.findMany({
			where: {
				...(type === 'in' && WHERE_IN(accountId.value)),
				...(type === 'out' && WHERE_OUT(accountId.value)),
				...(type === 'future' && WHERE_FUTURE(accountId.value)),
				...(type === 'all' && WHERE_ALL(accountId.value)),
				...((createdSince !== undefined || createdUntil !== undefined) && {
					created_at: {
						...(createdSince !== undefined && { gte: new Date(createdSince.value) }),
						...(createdUntil !== undefined && { lte: new Date(createdUntil.value) })
					}
				})
			},
			take: count,
			skip: page === 0 || page === 1 ? 0 : (page - 1) * count
		})

		return internalTransfers.map(transfer => {
			const transaction = Transaction.create({
				source_id: transfer.id,
				type: TransactionType.create({
					value:
						accountId.value === transfer.sender_account_id
							? TransactionTypeEnum.INTERNAL_TRANSFER_OUTBOUND
							: TransactionTypeEnum.INTERNAL_TRANSFER_INBOUND
				}),
				status: TransactionStatus.create({
					value:
						transfer.status === 'COMPLETED'
							? TransactionStatusEnum.POSTED
							: transfer.status === 'SCHEDULED'
							? TransactionStatusEnum.OPEN
							: TransactionStatusEnum.VOID
				}),
				amount: transfer.amount,
				created_at: transfer.created_at
			})

			if (transaction.isLeft()) throw new Error('Error on PrismaTransactionRepository.findByAccountId()')

			return transaction.value
		})
	}
}
