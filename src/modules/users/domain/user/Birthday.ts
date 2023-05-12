import moment from 'moment'

import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { type Either, right, left } from 'src/common/seedword/core/Either'
import { type Violation } from 'src/common/seedword/domain/Violation'

import { Guard } from 'src/common/seedword/core/Guard'
import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'
import { InvalidBirthdayViolation } from 'src/common/domain/violations/InvalidBirthdayViolation'

interface BirthdayProperties {
	value: string
}

export class Birthday extends ValueObject<BirthdayProperties> {
	get value(): string {
		return this.props.value
	}

	private static isValid(value: string): boolean {
		return moment(value, 'YYYY-MM-DD').isValid()
	}

	static create(value: string): Either<Violation, Birthday> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('birthday', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('birthday', value))
		}

		if (!this.isValid(value)) {
			return left(new InvalidBirthdayViolation(value))
		}

		return right(new Birthday({ value }))
	}
}
