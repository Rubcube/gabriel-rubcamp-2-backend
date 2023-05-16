import { Either, left, combineLefts, right } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { UUID } from 'common/seedword/domain/UUID'
import { User } from '../User'

import { Name } from '../Name'
import { Email } from '../Email'
import { Birthday } from '../Birthday'
import { Phone } from '../Phone'
import { Document } from '../Document'
import { Address } from '../Address'
import { Password } from '../Password'

type CreateUserProperties = {
	id: string
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
		updated_at: Date
	}
	created_at: Date
	updated_at: Date
}

export function createUser(properties: CreateUserProperties): Either<Violation[], User> {
	const id = UUID.createFrom({ value: properties.id, field: 'id' })
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
	const address = createAddress({ address: properties.address })

	if (
		id.isLeft() ||
		name.isLeft() ||
		email.isLeft() ||
		birthday.isLeft() ||
		phone.isLeft() ||
		document.isLeft() ||
		password.isLeft() ||
		address.isLeft()
	) {
		return left(combineLefts(id, name, email, birthday, phone, document, password, address))
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
				created_at: properties.created_at,
				updated_at: properties.updated_at
			},
			id.value
		)
	)
}

export function createAddress(properties: Pick<CreateUserProperties, 'address'>): Either<Violation[], Address> {
	const address = Address.create({
		zipcode: properties.address.zipcode,
		city: properties.address.city,
		state: properties.address.state,
		street: properties.address.street,
		number: properties.address.number,
		complement: properties.address.complement,
		neighborhood: properties.address.neighborhood,
		updated_at: properties.address.updated_at
	})

	if (address.isLeft()) {
		return left(address.value)
	}

	return right(address.value)
}
