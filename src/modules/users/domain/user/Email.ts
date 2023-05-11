import { z } from 'zod'

import { ValueObject } from 'common/seedword/domain/ValueObject'
import { type Either, right, left } from 'common/seedword/core/Either'
import { type Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'

import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { InvalidEmailViolation } from 'common/domain/violations/InvalidEmailViolation'

interface EmailProperties {
	value: string
}

export class Email extends ValueObject<EmailProperties> {
	get value(): string {
		return this.props.value
	}

	private static format(properties: EmailProperties): EmailProperties {
		return {
			value: properties.value.trim()
		}
	}

	private static isValid(properties: EmailProperties): boolean {
		return z.string().email().safeParse(properties.value).success
	}

	static create(value: string): Either<Violation, Email> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('email', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('email', value))
		}

		const properties = this.format({ value })

		if (!this.isValid(properties)) {
			return left(new InvalidEmailViolation(value))
		}

		return right(new Email(properties))
	}
}
