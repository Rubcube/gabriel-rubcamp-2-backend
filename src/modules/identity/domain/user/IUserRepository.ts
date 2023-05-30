import { Account } from '../account/Account'
import { User } from './User'

export type IUserRepository = {
	findById: (id: string) => Promise<User | null>
	findByIdWithAccount: (id: string) => Promise<{ user: User; account: Account } | null>
	findByDocument: (document: string) => Promise<User | null>
	emailExists: (email: string) => Promise<boolean>
	documentExists: (document: string) => Promise<boolean>
	phoneExists: (phone: { country_code: string; area_code: string; number: string }) => Promise<boolean>
	create: (user: User, account: Account) => Promise<void>
	verify: (user: User, account: Account) => Promise<void>
	addVerificationAttempt: (user: User) => Promise<void>
	updatePassword: (user: User) => Promise<void>
	save: (user: User, account: Account) => Promise<void>
}
