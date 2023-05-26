import { User as PrismaUser, Address as PrismaAddress } from '@prisma/client'
import moment from 'moment'

import { createUser } from '../domain/user/factories/createUser'

import { User } from '../domain/user/User'
import { UserDTO } from '../dtos/UserDTO'

export class UserMapper {
	static toDomain(payload: PrismaUser & { address: PrismaAddress }): User {
		const user = createUser({
			id: payload.id,
			name: payload.name,
			email: payload.email,
			birthday: moment(payload.birthday).format('YYYY-MM-DD'),
			phone: {
				country_code: payload.phone.substring(0, 2),
				area_code: payload.phone.substring(2, 4),
				number: payload.phone.substring(4, 13)
			},
			document: payload.document,
			password: {
				value: payload.password,
				hashed: true
			},
			address: {
				zipcode: payload.address.zipcode,
				city: payload.address.city,
				state: payload.address.state,
				street: payload.address.street,
				number: payload.address.number,
				complement: payload.address.complement,
				neighborhood: payload.address.neighborhood,
				updated_at: payload.address.updated_at
			},
			isPhoneVerified: payload.isPhoneVerified,
			isEmailVerified: payload.isEmailVerified,
			verificationAttempts: payload.verificationAttempts,
			lastVerificationTry: payload.lastVerificationTry ?? undefined,
			created_at: payload.created_at,
			updated_at: payload.updated_at
		})

		if (user.isLeft()) throw new Error('Error on UserMapper.toDomain()')

		return user.value
	}

	static toDTO(user: User): UserDTO {
		return {
			id: user.id.value,
			name: user.props.name.value,
			email: user.props.email.value,
			birthday: user.props.birthday.value,
			phone: {
				country_code: user.props.phone.country_code,
				area_code: user.props.phone.area_code,
				number: user.props.phone.number
			},
			document: user.props.document.value,
			address: {
				zipcode: user.props.address.props.zipcode,
				city: user.props.address.props.city,
				state: user.props.address.props.state,
				street: user.props.address.props.street,
				number: user.props.address.props.number,
				complement: user.props.address.props.complement,
				neighborhood: user.props.address.props.neighborhood,
				updated_at: user.props.address.props.updated_at.toISOString()
			},
			created_at: user.props.created_at?.toISOString(),
			updated_at: user.props.updated_at?.toISOString()
		}
	}
}
