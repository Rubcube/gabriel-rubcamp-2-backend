import { randomUUID } from 'crypto'
import { Identifier } from './Identifier'
import { Either, right, left } from '../core/Either'

import { Violation } from './Violation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { WrongUUIDViolation } from 'common/domain/violations/WrongUUIDViolation'

export class UUID extends Identifier<string> {
	constructor(id?: string) {
		super(id ?? randomUUID())
	}

	static isValid(value?: string): boolean {
		return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value ?? '')
	}

	static createFrom(properties: { value: string; field: string }): Either<Violation, UUID> {
		if (typeof properties.value !== 'string') {
			return left(new WrongTypeViolation(properties.field, properties.value))
		}

		if (!this.isValid(properties.value)) {
			return left(new WrongUUIDViolation(properties.field))
		}

		return right(new UUID(properties.value))
	}
}
