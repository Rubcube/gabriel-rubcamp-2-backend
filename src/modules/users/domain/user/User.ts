import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'

import { type UUID } from 'common/seedword/domain/UUID'
import { type Name } from './Name'
import { type Email } from './Email'
import { type Birthday } from './Birthday'
import { type Phone } from './Phone'
import { type Document } from './Document'
import { type Password } from './Password'
import { type Address } from './Address'
import { type Timestamp } from 'common/domain/Timestamp'

interface UserProperties {
	name: Name
	email: Email
	birthday: Birthday
	phone: Phone
	document: Document
	password: Password
	address: Address
	created_at: Timestamp
	updated_at: Timestamp
}

export class User extends AggregateRoot<UserProperties> {
	private constructor(properties: UserProperties, id?: UUID) {
		super(properties, id)
	}

	static create(properties: UserProperties, id?: UUID): User {
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
}
