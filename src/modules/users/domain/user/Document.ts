import { ValueObject } from 'src/common/seedword/domain/ValueObject'
import { type Either, right, left } from 'src/common/seedword/core/Either'
import { type Violation } from 'src/common/seedword/domain/Violation'

import { Guard } from 'src/common/seedword/core/Guard'

import { WrongTypeViolation } from 'src/common/domain/violations/WrongTypeViolation'
import { RequiredViolation } from 'src/common/domain/violations/RequiredViolation'
import { InvalidDocumentViolation } from 'src/common/domain/violations/InvalidDocumentViolation'

interface DocumentProperties {
	value: string
}

export class Document extends ValueObject<DocumentProperties> {
	get value(): string {
		return this.props.value
	}

	private static isValid(properties: DocumentProperties): boolean {
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
