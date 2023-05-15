import moment from 'moment'

import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { Either, right, left } from 'src/common/seedword/core/Either'
import { Violation } from 'src/common/seedword/domain/Violation'

import { Guard } from 'src/common/seedword/core/Guard'
import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'
import { InvalidBirthdayViolation } from 'src/common/domain/violations/InvalidBirthdayViolation'

type BirthdayProperties = {
	value: string
}

export class Birthday extends ValueObject<BirthdayProperties> {
	get value(): string {
		return this.props.value
	}

	private static isValid(properties: BirthdayProperties): boolean {
		const dateToCheck = moment(properties.value, 'YYYY-MM-DD', true)

		if (!dateToCheck.isValid()) return false

		if (!dateToCheck.isSameOrBefore(moment().startOf('day'))) return false

		return true
	}

	static create(value: string): Either<Violation, Birthday> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('birthday', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('birthday', value))
		}

		if (!this.isValid({ value })) {
			return left(new InvalidBirthdayViolation(value))
		}

		return right(new Birthday({ value }))
	}
}
