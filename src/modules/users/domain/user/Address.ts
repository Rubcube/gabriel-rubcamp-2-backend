import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { Either, right, left } from 'src/common/seedword/core/Either'
import { Violation } from 'src/common/seedword/domain/Violation'

import { Guard } from 'src/common/seedword/core/Guard'

import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'

type AddressProperties = {
	zipcode: string
	city: string
	state: string
	street: string
	number: string
	complement: string
	neighborhood: string
	updated_at: Date
}

type CreateNewAddressProperties = {
	updated_at?: Date
} & Omit<AddressProperties, 'updated_at'>

export class Address extends ValueObject<AddressProperties> {
	static create(properties: CreateNewAddressProperties): Either<Violation[], Address> {
		const null_undefined_guard_result = Guard.againstNullOrUndefinedBulk([
			{
				field: 'address.zipcode',
				value: properties.zipcode
			},
			{
				field: 'address.city',
				value: properties.city
			},
			{
				field: 'address.state',
				value: properties.state
			},
			{
				field: 'address.street',
				value: properties.street
			},
			{
				field: 'address.number',
				value: properties.number
			},
			{
				field: 'address.complement',
				value: properties.complement
			},
			{
				field: 'address.neighborhood',
				value: properties.neighborhood
			}
		])

		if (null_undefined_guard_result.fail) {
			return left(null_undefined_guard_result.fields.map(field => new RequiredViolation(field)))
		}

		const type_guard_result = Guard.isOfTypeBulk('string', [
			{
				field: 'address.zipcode',
				value: properties.zipcode
			},
			{
				field: 'address.city',
				value: properties.city
			},
			{
				field: 'address.state',
				value: properties.state
			},
			{
				field: 'address.street',
				value: properties.street
			},
			{
				field: 'address.number',
				value: properties.number
			},
			{
				field: 'address.complement',
				value: properties.complement
			},
			{
				field: 'address.neighborhood',
				value: properties.neighborhood
			}
		])

		if (type_guard_result.fail) {
			return left(type_guard_result.fields.map(field => new WrongTypeViolation(field)))
		}

		return right(
			new Address({
				zipcode: properties.zipcode,
				city: properties.city,
				state: properties.state,
				street: properties.street,
				number: properties.number,
				complement: properties.complement,
				neighborhood: properties.neighborhood,
				updated_at: properties.updated_at ?? new Date()
			})
		)
	}
}
