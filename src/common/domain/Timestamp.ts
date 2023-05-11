import { type Either, right, left } from 'common/seedword/core/Either'
import { type Violation } from 'common/seedword/domain/Violation'
import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Guard } from 'common/seedword/core/Guard'

import { WrongTypeViolation } from './violations/WrongTypeViolation'
import { RequiredViolation } from './violations/RequiredViolation'

export interface TimestampProperties {
	value: string
}

export class Timestamp extends ValueObject<TimestampProperties> {
	get value(): string {
		return this.props.value
	}

	protected constructor(props: TimestampProperties) {
		super(props)
	}

	static create(properties: { value?: string; field?: string }): Either<Violation, Timestamp> {
		if (properties.value) {
			return this.createFrom({ value: properties.value })
		}

		return right(new Timestamp({ value: new Date().toISOString() }))
	}

	static createFrom(properties: { value: string; field?: string }): Either<Violation, Timestamp> {
		if (Guard.againstNullOrUndefined(properties.value).fail) {
			return left(new RequiredViolation(properties.field ?? 'timestamp', String(properties.value)))
		}

		if (Guard.isOfType('string', properties.value).fail) {
			return left(new WrongTypeViolation(properties.field ?? 'timestamp', typeof properties.value))
		}

		return right(new Timestamp({ value: properties.value }))
	}

	static createNullable(properties: { value?: string; field?: string }): Either<Violation, Timestamp | null> {
		if (!properties.value) {
			return right(null)
		}

		return this.create({ value: properties.value })
	}
}
