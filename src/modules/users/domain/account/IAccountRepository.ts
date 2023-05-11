import { type Account } from './Account'

export interface IAccountRepository {
	findById: (id: string) => Promise<Account | undefined>
	findByUserId: (userId: string) => Promise<Account | undefined>
	create: (account: Account) => Promise<void>
	save: (account: Account) => Promise<void>
	delete: (account: Account) => Promise<void>
}
