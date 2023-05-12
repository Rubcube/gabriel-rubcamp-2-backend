import { prisma } from 'infrastructure/prisma/client'

import { type User } from '../domain/user/User'
import { type IUserRepository } from '../domain/user/IUserRepository'
import { UserMapper } from '../mappers/UserMapper'

export class PrismaUserRepository implements IUserRepository {
	async findByDocument(document?: string): Promise<User | undefined> {
		const user = await prisma.user.findUnique({
			where: {
				document
			},
			include: {
				address: true
			}
		})

		if (user == null || user.address == null) return undefined

		return UserMapper.toDomain({
			id: user.id,
			name: user.name,
			email: user.email,
			birthday: user.birthday,
			phone: user.phone,
			document: user.document,
			password: user.password,
			address: user.address,
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

	async create(user: User): Promise<void> {}

	async save(user: User): Promise<void> {
		await prisma.user.create({
			data: {
				id: user.id.value,
				name: user.props.name.value,
				email: user.props.email.value,
				birthday: user.props.birthday.value,
				phone: user.props.phone.parsed,
				document: user.props.document.value,
				password: await user.props.password.getHashedValue(),
				address: {
					create: {
						zipcode: user.props.address.props.zipcode,
						city: user.props.address.props.city,
						state: user.props.address.props.state,
						street: user.props.address.props.street,
						number: user.props.address.props.number,
						complement: user.props.address.props.complement,
						neighborhood: user.props.address.props.neighborhood,
						updated_at: user.props.address.props.updated_at.toISOString()
					}
				},
				created_at: user.props.created_at.toISOString(),
				updated_at: user.props.updated_at.toISOString()
			}
		})
	}

	async delete(user: User): Promise<void> {}
}
