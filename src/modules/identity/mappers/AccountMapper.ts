import { Account as PrismaAccount } from '@prisma/client'
import { Account } from '../domain/account/Account'
import { AccountDTO } from '../dtos/AccountDTO'
import { createAccount } from '../domain/account/factories/createAccount'

export class AccountMapper {
	static toDomain(payload: PrismaAccount): Account {
		const account = createAccount({
			id: payload.id,
			userId: payload.user_id,
			balance: payload.balance,
			account: payload.account,
			agency: payload.agency,
			status: payload.status,
			transactionalPassword: payload.transaction_password,
			loginAttempts: payload.login_attempts,
			createdAt: payload.created_at,
			updatedAt: payload.updated_at,
			closedAt: payload.closed_at ?? undefined,
			blockedAt: payload.blocked_at ?? undefined
		})

		if (account.isLeft()) throw new Error('Error on AccountMapper.toDomain()')

		return account.value
	}

	static toDTO(account: Account): AccountDTO {
		return {
			id: account.id.value,
			user_id: account.props.userId.value,
			balance: account.props.balance,
			account: account.props.account,
			agency: account.props.agency,
			status: account.props.status.props.value,
			created_at: account.props.createdAt?.toISOString(),
			updated_at: account.props.updatedAt?.toISOString(),
			closed_at: account.props.closedAt ? account.props.closedAt.toISOString() : null,
			blocked_at: account.props.blockedAt ? account.props.blockedAt.toISOString() : null
		}
	}
}
