import { ValueObject } from 'common/seedword/domain/ValueObject'
import { type Either, right, left } from 'common/seedword/core/Either'
import { type Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'

import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { InvalidPhoneViolation } from 'common/domain/violations/InvalidPhoneViolation'

interface PhoneProperties {
	country_code: string
	area_code: string
	number: string
}

export class Phone extends ValueObject<PhoneProperties> {
	get country_code(): string {
		return this.props.country_code
	}

	get area_code(): string {
		return this.props.area_code
	}

	get number(): string {
		return this.props.number
	}

	get parsed(): string {
		return `${this.country_code}${this.area_code}${this.number}`
	}

	private static isValid(properties: PhoneProperties): boolean {
		return (
			/^55$/.test(properties.country_code) &&
			/^[1-9][0-9]{1}$/.test(properties.area_code) &&
			/^[6-9][0-9]{8}$/.test(properties.number)
		)
	}

	static create(properties: PhoneProperties): Either<Violation, Phone> {
		if (Guard.againstNullOrUndefined(properties.country_code).fail) {
			return left(new RequiredViolation('phone.country_code', properties.country_code))
		}

		if (Guard.againstNullOrUndefined(properties.area_code).fail) {
			return left(new RequiredViolation('phone.area_code', properties.area_code))
		}

		if (Guard.againstNullOrUndefined(properties.number).fail) {
			return left(new RequiredViolation('phone.number', properties.number))
		}

		if (Guard.isOfType('string', properties.country_code).fail) {
			return left(new WrongTypeViolation('phone.country_code', properties.country_code))
		}

		if (Guard.isOfType('string', properties.area_code).fail) {
			return left(new WrongTypeViolation('phone.area_code', properties.area_code))
		}

		if (Guard.isOfType('string', properties.number).fail) {
			return left(new WrongTypeViolation('phone.number', properties.number))
		}

		if (!this.isValid(properties)) {
			return left(new InvalidPhoneViolation())
		}

		return right(
			new Phone({
				country_code: properties.country_code,
				area_code: properties.area_code,
				number: properties.number
			})
		)
	}
}
