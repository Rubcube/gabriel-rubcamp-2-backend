import { prisma } from 'infrastructure/prisma/client'

import { Account } from '../domain/account/Account'
import { IAccountRepository } from '../domain/account/IAccountRepository'
import { AccountMapper } from '../mappers/AccountMapper'

export class PrismaAccountRepository implements IAccountRepository {
	async findById(id: string): Promise<Account | undefined> {
		return undefined
	}

	async findByUserId(user_id: string): Promise<Account | undefined> {
		const account = await prisma.account.findUnique({
			where: {
				user_id
			}
		})

		if (account == null) return undefined

		return AccountMapper.toDomain(account)
	}

	async save(account: Account): Promise<void> {}

	async delete(account: Account): Promise<void> {}
}
