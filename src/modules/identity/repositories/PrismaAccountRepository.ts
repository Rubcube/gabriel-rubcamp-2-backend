import { prisma } from 'infrastructure/prisma/client'

import { Account } from '../domain/account/Account'
import { IAccountRepository } from '../domain/account/IAccountRepository'
import { AccountMapper } from '../mappers/AccountMapper'

export class PrismaAccountRepository implements IAccountRepository {
	async findById(id: string): Promise<Account | null> {
		return null
	}

	async findByUserId(user_id: string): Promise<Account | null> {
		const account = await prisma.account.findUnique({
			where: {
				user_id
			}
		})

		return account ? AccountMapper.toDomain(account) : null
	}

	async findBalanceById(id: string): Promise<number | null> {
		const account = await prisma.account.findUnique({
			where: {
				id
			},
			select: {
				balance: true
			}
		})

		return account ? account.balance : null
	}
}
