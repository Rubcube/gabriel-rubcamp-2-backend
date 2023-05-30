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
				countryCode: payload.phone.substring(0, 2),
				areaCode: payload.phone.substring(2, 4),
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
				updatedAt: payload.address.updated_at
			},
			isPhoneVerified: payload.is_phone_verified,
			isEmailVerified: payload.is_email_verified,
			verificationAttempts: payload.verification_attempts,
			lastVerificationTry: payload.last_verification_try ?? undefined,
			createdAt: payload.created_at,
			updatedAt: payload.updated_at
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
				country_code: user.props.phone.countryCode,
				area_code: user.props.phone.areaCode,
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
				updated_at: user.props.address.props.updatedAt.toISOString()
			},
			is_email_verified: user.isEmailVerified,
			is_phone_verified: user.isPhoneVerified,
			created_at: user.props.createdAt?.toISOString(),
			updated_at: user.props.updatedAt?.toISOString()
		}
	}
}
