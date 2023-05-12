import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { type Either, right, left } from 'src/common/seedword/core/Either'
import { type Violation } from 'src/common/seedword/domain/Violation'
import { BadPasswordFormatViolation } from 'src/common/domain/violations/BadPasswordFormatViolation'
import { Guard } from 'src/common/seedword/core/Guard'
import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'

interface TransactionalPasswordProperties {
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
