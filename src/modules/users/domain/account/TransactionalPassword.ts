import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'
import { BadPasswordFormatViolation } from 'common/domain/violations/BadPasswordFormatViolation'
import { Guard } from 'common/seedword/core/Guard'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'

type TransactionalPasswordProperties = {
	value: string
}

export class TransactionalPassword extends ValueObject<TransactionalPasswordProperties> {
	get value(): string {
		return this.props.value
	}

	static isValid(password: string): boolean {
		return /^\d{4}$/.test(password)
	}

	static create(value: string): Either<Violation, TransactionalPassword> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('transactional_password'))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('transactional_password', typeof value))
		}

		if (!this.isValid(value)) {
			return left(new BadPasswordFormatViolation('transactional_password', value))
		}

		return right(new TransactionalPassword({ value }))
	}
}
