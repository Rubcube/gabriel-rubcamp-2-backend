import { Account } from '../account/Account'
import { User } from './User'

export type IUserRepository = {
	findByDocument: (document: string) => Promise<User | undefined>
	emailExists: (email: string) => Promise<boolean>
	documentExists: (document: string) => Promise<boolean>
	phoneExists: (phone: { country_code: string; area_code: string; number: string }) => Promise<boolean>
	create: (user: User, account: Account) => Promise<void>
	save: (user: User) => Promise<void>
	delete: (user: User) => Promise<void>
}
