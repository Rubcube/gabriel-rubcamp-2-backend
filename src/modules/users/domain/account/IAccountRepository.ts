import { Account } from './Account'

export type IAccountRepository = {
	findById: (id: string) => Promise<Account | undefined>
	findByUserId: (userId: string) => Promise<Account | undefined>
	save: (account: Account) => Promise<void>
	delete: (account: Account) => Promise<void>
}
