import { User } from 'modules/identity/domain/user/User'
import { IUserRepository } from 'modules/identity/domain/user/IUserRepository'

import { Account } from 'modules/identity/domain/account/Account'
import { InMemoryAccountRepository } from './InMemoryAccountRepository'

export class InMemoryUserRepository implements IUserRepository {
	users: User[] = []

	constructor(private readonly accountRepository: InMemoryAccountRepository) {}

	async findById(id: string): Promise<User | null> {
		const user = this.users.find(user => user.id.value === id)

		return user ?? null
	}

	async findByIdWithAccount(id: string): Promise<{ user: User; account: Account } | null> {
		const user = this.users.find(user => user.id.value === id)

		if (!user) return null

		const account = await this.accountRepository.findById(user.id.value)

		if (!account) return null

		return { user, account }
	}

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

	async verify(user: User, account: Account): Promise<void> {
		await this.save(user, account)
	}

	async addVerificationAttempt(user: User): Promise<void> {
		const foundUserIndex = this.users.findIndex(value => value.id.equals(user.id))

		if (foundUserIndex === -1) return

		this.users[foundUserIndex] = user
	}

	async updatePassword(user: User): Promise<void> {
		const foundUserIndex = this.users.findIndex(value => value.id.equals(user.id))

		if (foundUserIndex === -1) return

		this.users[foundUserIndex] = user
	}

	async save(user: User, account: Account): Promise<void> {
		const foundUser = this.users.find(value => value.id.equals(user.id))
		const foundUserIndex = this.users.findIndex(value => value.id.equals(user.id))

		if (foundUserIndex === -1 || !foundUser) return

		const foundAccount = await this.accountRepository.findById(account.id.value)
		const foundAccountIndex = this.accountRepository.accounts.findIndex(value => value.id.equals(account.id))

		if (foundAccountIndex === -1 || !foundAccount) return

		this.users[foundUserIndex] = foundUser
		this.accountRepository.accounts[foundAccountIndex] = foundAccount
	}
}
