import { ValueObject } from 'common/seedword/domain/ValueObject'
import { type Either, right } from 'common/seedword/core/Either'
import { type Violation } from 'common/seedword/domain/Violation'

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
		return right(new TransactionalPassword({ value }))
	}
}
