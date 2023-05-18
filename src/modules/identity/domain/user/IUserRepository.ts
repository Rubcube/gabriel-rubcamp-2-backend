import { Account } from '../account/Account'
import { User } from './User'

export type IUserRepository = {
	findByIdWithAccount: (id: string) => Promise<{ user: User; account: Account } | null>
	findByDocument: (document: string) => Promise<User | null>
	emailExists: (email: string) => Promise<boolean>
	documentExists: (document: string) => Promise<boolean>
	phoneExists: (phone: { country_code: string; area_code: string; number: string }) => Promise<boolean>
	create: (user: User, account: Account) => Promise<void>
}
