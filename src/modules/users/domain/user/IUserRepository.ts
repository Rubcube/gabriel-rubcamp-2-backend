import { type User } from './User'

export interface IUserRepository {
	findByDocument: (document: string) => Promise<User | undefined>
	emailExists: (email: string) => Promise<boolean>
	documentExists: (document: string) => Promise<boolean>
	phoneExists: (phone: string) => Promise<boolean>
	create: (user: User) => Promise<void>
	save: (user: User) => Promise<void>
	delete: (user: User) => Promise<void>
}
