import { Account as PrismaAccount } from '@prisma/client'
import { Account } from '../domain/account/Account'
import { AccountDTO } from '../dtos/AccountDTO'
import { createAccount } from '../domain/account/factories/createAccount'

export class AccountMapper {
	static toDomain(payload: PrismaAccount): Account {
		const account = createAccount({
			id: payload.id,
			user_id: payload.user_id,
			balance: payload.balance,
			account: payload.account,
			agency: payload.agency,
			status: payload.status,
			transactional_password: payload.transaction_password,
			loginAttempts: payload.login_attempts,
			created_at: payload.created_at,
			updated_at: payload.updated_at,
			closed_at: payload.closed_at ?? undefined,
			blocked_at: payload.blocked_at ?? undefined
		})

		if (account.isLeft()) throw new Error('Error on AccountMapper.toDomain()')

		return account.value
	}

	static toDTO(account: Account): AccountDTO {
		return {
			id: account.id.value,
			user_id: account.props.user_id.value,
			balance: account.props.balance,
			account: account.props.account,
			agency: account.props.agency,
			status: account.props.status.props.value,
			created_at: account.props.created_at?.toISOString(),
			updated_at: account.props.updated_at?.toISOString(),
			closed_at: account.props.closed_at ? account.props.closed_at.toISOString() : null,
			blocked_at: account.props.blocked_at ? account.props.blocked_at.toISOString() : null
		}
	}
}
