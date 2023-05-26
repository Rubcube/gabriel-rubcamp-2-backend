import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'

import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { InvalidDocumentViolation } from 'common/domain/violations/InvalidDocumentViolation'

type DocumentProperties = {
	value: string
}

export class Document extends ValueObject<DocumentProperties> {
	get value(): string {
		return this.props.value
	}

	private static isValid(properties: DocumentProperties): boolean {
		if (properties.value.length !== 11 || /^(\d)\1{10}$/.test(properties.value)) {
			return false
		}

		let sum
		let rest
		sum = 0

		for (let i = 1; i <= 9; i++) {
			sum = sum + parseInt(properties.value.substring(i - 1, i)) * (11 - i)
		}
		rest = (sum * 10) % 11

		if (rest === 10 || rest === 11) rest = 0
		if (rest !== parseInt(properties.value.substring(9, 10))) return false

		sum = 0
		for (let i = 1; i <= 10; i++) {
			sum = sum + parseInt(properties.value.substring(i - 1, i)) * (12 - i)
		}
		rest = (sum * 10) % 11

		if (rest === 10 || rest === 11) rest = 0

		if (rest !== parseInt(properties.value.substring(10, 11))) return false

		return true
	}

	static create(value: string): Either<Violation, Document> {
		if (Guard.againstNullOrUndefined(value).fail) {
			return left(new RequiredViolation('document', value))
		}

		if (Guard.isOfType('string', value).fail) {
			return left(new WrongTypeViolation('document', value))
		}

		if (!this.isValid({ value })) {
			return left(new InvalidDocumentViolation(value))
		}

		return right(new Document({ value }))
	}
}
