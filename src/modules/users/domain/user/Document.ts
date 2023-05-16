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

		let soma = 0
		for (let i = 0; i < 9; i++) {
			soma += parseInt(properties.value.charAt(i)) * (10 - i)
		}

		const digit1 = soma % 11 > 2 ? 11 - (soma % 11) : 0

		soma = 0
		for (let i = 0; i < 10; i++) {
			soma += parseInt(properties.value.charAt(i)) * (11 - i)
		}

		const digit2 = soma % 11 > 2 ? 11 - (soma % 11) : 0

		return properties.value === `${properties.value.substring(0, 9)}${digit1}${digit2}`
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
