import { prisma } from 'infrastructure/prisma/client'

import { type Account } from '../domain/account/Account'
import { type IAccountRepository } from '../domain/account/IAccountRepository'
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

	async create(account: Account): Promise<void> {}

	async save(account: Account): Promise<void> {
		await prisma.account.create({
			data: {
				user: {
					connect: {
						id: account.props.user_id.value
					}
				},
				balance: account.props.balance,
				account: account.props.account,
				agency: account.props.agency,
				status: 'OPEN',
				transaction_password: account.props.transactional_password.value,
				created_at: account.props.created_at,
				updated_at: account.props.updated_at,
				closed_at: account.props.closed_at,
				blocked_at: account.props.blocked_at
			}
		})
	}

	async delete(account: Account): Promise<void> {}
}
