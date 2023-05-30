import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'

import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { InvalidPhoneViolation } from 'common/domain/violations/InvalidPhoneViolation'

type PhoneProperties = {
	countryCode: string
	areaCode: string
	number: string
}

export class Phone extends ValueObject<PhoneProperties> {
	get countryCode(): string {
		return this.props.countryCode
	}

	get areaCode(): string {
		return this.props.areaCode
	}

	get number(): string {
		return this.props.number
	}

	get parsed(): string {
		return `${this.countryCode}${this.areaCode}${this.number}`
	}

	private static isValid(properties: PhoneProperties): boolean {
		return (
			/^55$/.test(properties.countryCode) &&
			/^[1-9][0-9]{1}$/.test(properties.areaCode) &&
			/^[6-9][0-9]{8}$/.test(properties.number)
		)
	}

	static create(properties: PhoneProperties): Either<Violation[], Phone> {
		const null_undefined_guard_result = Guard.againstNullOrUndefinedBulk([
			{
				field: 'phone.country_code',
				value: properties.countryCode
			},
			{
				field: 'phone.area_code',
				value: properties.areaCode
			},
			{
				field: 'phone.number',
				value: properties.number
			}
		])

		if (null_undefined_guard_result.fail) {
			return left(null_undefined_guard_result.fields.map(field => new RequiredViolation(field)))
		}

		const type_guard_result = Guard.isOfTypeBulk('string', [
			{
				field: 'phone.country_code',
				value: properties.countryCode
			},
			{
				field: 'phone.area_code',
				value: properties.areaCode
			},
			{
				field: 'phone.number',
				value: properties.number
			}
		])

		if (type_guard_result.fail) {
			return left(type_guard_result.fields.map(field => new WrongTypeViolation(field)))
		}

		if (!this.isValid(properties)) {
			return left([new InvalidPhoneViolation()])
		}

		return right(
			new Phone({
				countryCode: properties.countryCode,
				areaCode: properties.areaCode,
				number: properties.number
			})
		)
	}
}
