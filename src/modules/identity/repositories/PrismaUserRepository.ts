import prisma from 'infrastructure/prisma/client'

import { User } from 'modules/identity/domain/user/User'
import { UserMapper } from 'modules/identity/mappers/UserMapper'
import { IUserRepository } from 'modules/identity/domain/user/IUserRepository'

import { Account } from 'modules/identity/domain/account/Account'
import { AccountMapper } from 'modules/identity/mappers/AccountMapper'

export class PrismaUserRepository implements IUserRepository {
	async findById(id: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				id
			},
			include: {
				address: true
			}
		})

		if (user == null || user.address == null) return null

		return UserMapper.toDomain({
			id: user.id,
			name: user.name,
			email: user.email,
			birthday: user.birthday,
			phone: user.phone,
			document: user.document,
			password: user.password,
			address: user.address,
			isPhoneVerified: user.isPhoneVerified,
			isEmailVerified: user.isEmailVerified,
			verificationAttempts: user.verificationAttempts,
			lastVerificationTry: user.lastVerificationTry,
			created_at: user.created_at,
			updated_at: user.updated_at
		})
	}

	async findByIdWithAccount(id: string): Promise<{ user: User; account: Account } | null> {
		const data = await prisma.user.findUnique({
			where: {
				id
			},
			include: {
				account: true,
				address: true
			}
		})

		if (data == null || data.address == null || data.account == null) return null

		return {
			user: UserMapper.toDomain({
				id: data.id,
				name: data.name,
				email: data.email,
				birthday: data.birthday,
				phone: data.phone,
				document: data.document,
				password: data.password,
				address: data.address,
				isPhoneVerified: data.isPhoneVerified,
				isEmailVerified: data.isEmailVerified,
				verificationAttempts: data.verificationAttempts,
				lastVerificationTry: data.lastVerificationTry,
				created_at: data.created_at,
				updated_at: data.updated_at
			}),
			account: AccountMapper.toDomain(data.account)
		}
	}

	async findByDocument(document?: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: {
				document
			},
			include: {
				address: true
			}
		})

		if (user == null || user.address == null) return null

		return UserMapper.toDomain({
			id: user.id,
			name: user.name,
			email: user.email,
			birthday: user.birthday,
			phone: user.phone,
			document: user.document,
			password: user.password,
			address: user.address,
			isPhoneVerified: user.isPhoneVerified,
			isEmailVerified: user.isEmailVerified,
			verificationAttempts: user.verificationAttempts,
			lastVerificationTry: user.lastVerificationTry,
			created_at: user.created_at,
			updated_at: user.updated_at
		})
	}

	async emailExists(email?: string): Promise<boolean> {
		return (
			(await prisma.user.count({
				where: {
					email
				}
			})) !== 0
		)
	}

	async documentExists(document?: string): Promise<boolean> {
		return (
			(await prisma.user.count({
				where: {
					document
				}
			})) !== 0
		)
	}

	async phoneExists(phone: { country_code: string; area_code: string; number: string }): Promise<boolean> {
		return (
			(await prisma.user.count({
				where: {
					phone: `${phone.country_code}${phone.area_code}${phone.number}`
				}
			})) !== 0
		)
	}

	async create(user: User, account: Account): Promise<void> {
		await prisma.user.create({
			data: {
				id: user.id.value,
				name: user.name.value,
				email: user.email.value,
				birthday: new Date(user.birthday.value).toISOString(),
				phone: user.phone.parsed,
				document: user.document.value,
				password: await user.password.getHashedValue(),
				address: {
					create: {
						zipcode: user.address.props.zipcode,
						city: user.address.props.city,
						state: user.address.props.state,
						street: user.address.props.street,
						number: user.address.props.number,
						complement: user.address.props.complement,
						neighborhood: user.address.props.neighborhood
					}
				},
				account: {
					create: {
						balance: account.props.balance,
						account: account.props.account,
						agency: account.props.agency,
						status: account.props.status.props.value,
						transaction_password: account.props.transactional_password.value,
						created_at: account.props.created_at,
						updated_at: account.props.updated_at,
						closed_at: account.props.closed_at,
						blocked_at: account.props.blocked_at
					}
				}
			}
		})
	}

	async addVerificationAttempt(user: User): Promise<void> {
		await prisma.user.update({
			where: {
				id: user.id.value
			},
			data: {
				verificationAttempts: user.verificationAttempts,
				lastVerificationTry: user.lastVerificationTry
			}
		})
	}

	async verify(user: User, account: Account): Promise<void> {
		await prisma.user.update({
			where: {
				id: user.id.value
			},
			data: {
				verificationAttempts: user.verificationAttempts,
				lastVerificationTry: user.lastVerificationTry,
				isPhoneVerified: user.isPhoneVerified,
				isEmailVerified: user.isEmailVerified,
				...(user.isVerified && {
					account: {
						update: {
							status: account.props.status.props.value
						}
					}
				})
			}
		})
	}

	async updatePassword(user: User): Promise<void> {
		await prisma.user.update({
			where: {
				id: user.id.value
			},
			data: {
				password: await user.password.getHashedValue()
			}
		})
	}

	async save(user: User, account: Account): Promise<void> {
		await prisma.user.update({
			where: {
				id: user.id.value
			},
			data: {
				name: user.name.value,
				email: user.email.value,
				birthday: new Date(user.birthday.value).toISOString(),
				phone: `${user.phone.country_code}${user.phone.area_code}${user.phone.number}`,
				document: user.document.value,
				password: await user.password.getHashedValue(),
				verificationAttempts: user.verificationAttempts,
				lastVerificationTry: user.lastVerificationTry,
				isPhoneVerified: user.isPhoneVerified,
				isEmailVerified: user.isEmailVerified,
				address: {
					update: {
						zipcode: user.props.address.props.zipcode,
						city: user.props.address.props.city,
						state: user.props.address.props.state,
						street: user.props.address.props.street,
						number: user.props.address.props.number,
						complement: user.props.address.props.complement,
						neighborhood: user.props.address.props.neighborhood
					}
				},
				account: {
					update: {
						status: account.props.status.props.value
					}
				}
			}
		})
	}
}
