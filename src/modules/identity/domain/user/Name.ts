import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'

import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { BadLengthViolation } from 'common/domain/violations/BadLengthViolation'

type NameProperties = {
	value: string
}

export class Name extends ValueObject<NameProperties> {
	get value(): string {
		return this.props.value
	}

	private static format(properties: NameProperties): NameProperties {
		return {
			value: properties.value.trim()
		}
	}

	static create(value: string): Either<Violation, Name> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('name', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('name', value))
		}

		const properties = this.format({ value })

		if (Guard.inRange(2, 256, properties.value.length).fail) {
			return left(new BadLengthViolation('name', value))
		}

		return right(new Name(properties))
	}
}
