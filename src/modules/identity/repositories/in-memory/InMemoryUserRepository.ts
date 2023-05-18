import { User } from 'modules/identity/domain/user/User'
import { IUserRepository } from 'modules/identity/domain/user/IUserRepository'

import { Account } from 'modules/identity/domain/account/Account'
import { InMemoryAccountRepository } from './InMemoryAccountRepository'

export class InMemoryUserRepository implements IUserRepository {
	users: User[] = []

	constructor(private readonly accountRepository: InMemoryAccountRepository) {}

	async findByDocument(document?: string): Promise<User | null> {
		const user = this.users.find(user => user.props.document.value === document)

		return user ?? null
	}

	async emailExists(email?: string): Promise<boolean> {
		return this.users.some(user => user.props.email.value === email)
	}

	async documentExists(document?: string): Promise<boolean> {
		return this.users.some(user => user.props.document.value === document)
	}

	async phoneExists(phone: { country_code: string; area_code: string; number: string }): Promise<boolean> {
		return this.users.some(
			user =>
				user.props.phone.country_code === phone.country_code &&
				user.props.phone.area_code === phone.area_code &&
				user.props.phone.number === phone.number
		)
	}

	async create(user: User, account: Account): Promise<void> {
		this.users.push(user)
		this.accountRepository.accounts.push(account)
	}
}
