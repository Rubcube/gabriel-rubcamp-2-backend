import { z } from 'zod'

import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { type Either, right, left } from 'src/common/seedword/core/Either'
import { type Violation } from 'src/common/seedword/domain/Violation'

import { Guard } from 'src/common/seedword/core/Guard'

import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'
import { InvalidEmailViolation } from 'src/common/domain/violations/InvalidEmailViolation'

interface EmailProperties {
	value: string
}

export class Email extends ValueObject<EmailProperties> {
	get value(): string {
		return this.props.value
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

		if (!this.isValid({ value })) {
			return left(new InvalidEmailViolation(value))
		}

		return right(new Email({ value }))
	}
}
