import { Account } from 'modules/identity/domain/account/Account'
import { IAccountRepository } from 'modules/identity/domain/account/IAccountRepository'

export class InMemoryAccountRepository implements IAccountRepository {
	public accounts: Account[] = []

	async findById(id: string): Promise<Account | null> {
		const account = this.accounts.find(account => account.id.value === id)

		return account ?? null
	}

	async findByUserId(user_id: string): Promise<Account | null> {
		const account = this.accounts.find(account => account.props.user_id.value === user_id)

		return account ?? null
	}

	async findBalanceById(id: string): Promise<number | null> {
		const account = this.accounts.find(account => account.id.value === id)

		return account ? account.props.balance : null
	}
}
