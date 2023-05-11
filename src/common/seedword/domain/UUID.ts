import { randomUUID } from 'crypto'
import { Identifier } from './Identifier'
import { type Either, right, left } from '../core/Either'
import { type Violation } from './Violation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'

export class UUID extends Identifier<string> {
	private constructor(id?: string) {
		super(id ?? randomUUID())
	}

	static isValid(value?: string): boolean {
		return /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(value ?? '')
	}

	static create(): UUID {
		return new UUID()
	}

	static createFrom(properties: { value: string; field: string }): Either<Violation, UUID> {
		if (!this.isValid(properties.value)) {
			return left(new WrongTypeViolation(properties.field, properties.value))
		}

		return right(new UUID(properties.value))
	}

	static createUndefinable(properties: { value?: string; field: string }): Either<Violation, UUID | undefined> {
		if (!properties.value) {
			return right(undefined)
		}

		if (!this.isValid(properties.value)) {
			return left(new WrongTypeViolation(properties.field, properties.value))
		}

		return right(new UUID(properties.value))
	}
}
