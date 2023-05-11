import { type Either, left, combineLefts, right } from 'common/seedword/core/Either'
import { type Violation } from 'common/seedword/domain/Violation'

import { User } from '../User'
import { Name } from '../Name'
import { Email } from '../Email'
import { Birthday } from '../Birthday'
import { Phone } from '../Phone'
import { Document } from '../Document'
import { Address } from '../Address'
import { Timestamp } from 'common/domain/Timestamp'
import { Password } from '../Password'
import { UUID } from 'common/seedword/domain/UUID'

interface CreateUserProperties {
	id?: string
	name: string
	email: string
	birthday: string
	phone: {
		country_code: string
		area_code: string
		number: string
	}
	document: string
	password: {
		value: string
		hashed: boolean
	}
	address: {
		zipcode: string
		city: string
		state: string
		street: string
		number: string
		complement: string
		neighborhood: string
		updated_at?: string
	}
	created_at?: string
	updated_at?: string
}

export function createUser(properties: CreateUserProperties): Either<Violation[], User> {
	const id = UUID.createUndefinable({ value: properties.id, field: 'id' })
	const name = Name.create(properties.name)
	const email = Email.create(properties.email)
	const birthday = Birthday.create(properties.birthday)
	const phone = Phone.create({
		country_code: properties.phone.country_code,
		area_code: properties.phone.area_code,
		number: properties.phone.number
	})
	const document = Document.create(properties.document)
	const password = Password.create(properties.password.value, properties.password.hashed)
	const created_at = Timestamp.create({ value: properties.created_at, field: 'created_at' })
	const updated_at = Timestamp.create({ value: properties.updated_at, field: 'updated_at' })
	const address = createAddress({ address: properties.address })

	if (
		id.isLeft() ||
		name.isLeft() ||
		email.isLeft() ||
		birthday.isLeft() ||
		phone.isLeft() ||
		document.isLeft() ||
		password.isLeft() ||
		address.isLeft() ||
		created_at.isLeft() ||
		updated_at.isLeft()
	) {
		const addressLefts = address.isLeft() && address.value

		return left([
			...combineLefts(id, name, email, birthday, phone, document, password, created_at, updated_at).concat(
				addressLefts || []
			)
		])
	}

	return right(
		User.create(
			{
				name: name.value,
				email: email.value,
				birthday: birthday.value,
				phone: phone.value,
				document: document.value,
				password: password.value,
				address: address.value,
				created_at: created_at.value,
				updated_at: updated_at.value
			},
			id.value
		)
	)
}

export function createAddress(properties: Pick<CreateUserProperties, 'address'>): Either<Violation[], Address> {
	const updated_at = Timestamp.create({ value: properties.address.updated_at, field: 'address.updated_at' })

	if (updated_at.isLeft()) {
		return left([updated_at.value])
	}

	const address = Address.create({
		zipcode: properties.address.zipcode,
		city: properties.address.city,
		state: properties.address.state,
		street: properties.address.street,
		number: properties.address.number,
		complement: properties.address.complement,
		neighborhood: properties.address.neighborhood,
		updated_at: updated_at.value
	})

	if (address.isLeft()) {
		return left(address.value)
	}

	return right(address.value)
}
