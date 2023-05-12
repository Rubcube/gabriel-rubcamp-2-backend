import { AggregateRoot } from 'src/common/seedword/domain/AggregateRoot'

import { type UUID } from 'src/common/seedword/domain/UUID'
import { type Name } from './Name'
import { type Email } from './Email'
import { type Birthday } from './Birthday'
import { type Phone } from './Phone'
import { type Document } from './Document'
import { type Password } from './Password'
import { type Address } from './Address'

type UserProperties = {
	name: Name
	email: Email
	birthday: Birthday
	phone: Phone
	document: Document
	password: Password
	address: Address
	created_at: Date
	updated_at: Date
}

type CreateNewUserProperties = Omit<UserProperties, 'created_at' | 'updated_at'>

export class User extends AggregateRoot<UserProperties> {
	private constructor(properties: UserProperties, id?: UUID) {
		super(properties, id)
	}

	static create(properties: UserProperties, id: UUID): User {
		return new User(
			{
				name: properties.name,
				email: properties.email,
				birthday: properties.birthday,
				phone: properties.phone,
				document: properties.document,
				password: properties.password,
				address: properties.address,
				created_at: properties.created_at,
				updated_at: properties.updated_at
			},
			id
		)
	}

	static createNew(properties: CreateNewUserProperties): User {
		const now = new Date()

		return new User({
			name: properties.name,
			email: properties.email,
			birthday: properties.birthday,
			phone: properties.phone,
			document: properties.document,
			password: properties.password,
			address: properties.address,
			created_at: now,
			updated_at: now
		})
	}
}
