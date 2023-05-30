import { Account } from './Account'

export type IAccountRepository = {
	findById: (id: string) => Promise<Account | null>
	findByUserId: (userId: string) => Promise<Account | null>
	findBalanceById: (id: string) => Promise<number | null>
	addLoginAttempt: (account: Account) => Promise<void>
	login: (account: Account) => Promise<void>
}
