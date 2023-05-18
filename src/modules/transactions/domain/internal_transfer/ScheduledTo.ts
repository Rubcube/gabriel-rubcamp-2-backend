import moment from 'moment'

import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { InvalidScheduledDateViolation } from 'common/domain/violations/InvalidScheduledDateViolation'

type ScheduledToProperties = {
	value: string
}

export class ScheduledTo extends ValueObject<ScheduledToProperties> {
	get value(): string {
		return this.props.value
	}

	private static isValid(properties: ScheduledToProperties): boolean {
		const dateToCheck = moment(properties.value, 'YYYY-MM-DD', true)

		if (!dateToCheck.isValid()) return false

		if (!dateToCheck.isSameOrAfter(moment().add(1, 'day'), 'day')) return false

		return true
	}

	static create(value: string): Either<Violation, ScheduledTo> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('scheduled_to', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('scheduled_to', value))
		}

		if (!this.isValid({ value })) {
			return left(new InvalidScheduledDateViolation('scheduled_to', value))
		}

		return right(new ScheduledTo({ value }))
	}
}
