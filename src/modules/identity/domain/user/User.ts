import { AggregateRoot } from 'common/seedword/domain/AggregateRoot'

import { UUID } from 'common/seedword/domain/UUID'
import { Name } from './Name'
import { Email } from './Email'
import { Birthday } from './Birthday'
import { Phone } from './Phone'
import { Document } from './Document'
import { Password } from './Password'
import { Address } from './Address'

type UserProperties = {
	name: Name
	email: Email
	birthday: Birthday
	phone: Phone
	document: Document
	password: Password
	address: Address
	created_at?: Date
	updated_at?: Date
}

type CreateNewUserProperties = Omit<UserProperties, 'created_at' | 'updated_at'>

export class User extends AggregateRoot<UserProperties> {
	private constructor(properties: UserProperties, id?: UUID) {
		super(properties, id)
	}

	static create(properties: UserProperties, id: UUID): User {
		return new User(properties, id)
	}

	static createNew(properties: CreateNewUserProperties): User {
		return new User(properties)
	}
}
