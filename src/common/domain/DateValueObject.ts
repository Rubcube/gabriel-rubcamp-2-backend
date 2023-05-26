import moment from 'moment'

import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { WrongFormatViolation } from './violations/WrongFormatViolation'

type DateValueObjectProperties = {
	value: string
	field: string
}

export class DateValueObject extends ValueObject<DateValueObjectProperties> {
	get value(): string {
		return this.props.value
	}

	private static isValid(properties: DateValueObjectProperties): boolean {
		const dateToCheck = moment(properties.value, 'YYYY-MM-DD', true)

		if (!dateToCheck.isValid()) return false

		if (!dateToCheck.isSameOrBefore(moment().startOf('day'))) return false

		return true
	}

	static create(properties: DateValueObjectProperties): Either<Violation, DateValueObject> {
		if (Guard.againstNullOrUndefined(properties.value).fail) {
			return left(new RequiredViolation(properties.field, properties.value))
		}

		if (Guard.isOfType('string', properties.field).fail) {
			return left(new WrongTypeViolation(properties.field, typeof properties.value))
		}

		if (!this.isValid(properties)) {
			return left(new WrongFormatViolation(properties.field))
		}

		return right(new DateValueObject(properties))
	}
}
