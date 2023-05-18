import { prisma } from 'infrastructure/prisma/client'

import { Account } from 'modules/identity/domain/account/Account'
import { AccountMapper } from 'modules/identity/mappers/AccountMapper'
import { IAccountRepository } from 'modules/identity/domain/account/IAccountRepository'

export class PrismaAccountRepository implements IAccountRepository {
	async findById(id: string): Promise<Account | null> {
		const account = await prisma.account.findUnique({
			where: {
				id
			}
		})

		return account ? AccountMapper.toDomain(account) : null
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
