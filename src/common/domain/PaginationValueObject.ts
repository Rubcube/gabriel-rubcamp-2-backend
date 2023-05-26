import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, right, left } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'

import { Guard } from 'common/seedword/core/Guard'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'
import { WrongFormatViolation } from './violations/WrongFormatViolation'

type PaginationValueObjectProperties = {
	page: number
	count: number
}

export class PaginationValueObject extends ValueObject<PaginationValueObjectProperties> {
	get page(): number {
		return this.props.page
	}

	get count(): number {
		return this.props.count
	}

	private static isValidBulk(properties: PaginationValueObjectProperties): {
		fields: string[]
		fail: boolean
	} {
		const fields: string[] = []

		if (properties.page < 0) fields.push('page')
		if (properties.count < 0) fields.push('count')

		return {
			fields,
			fail: fields.length > 0
		}
	}

	static create(properties: Partial<PaginationValueObjectProperties>): Either<Violation[], PaginationValueObject> {
		const nullUndefinedGuard = Guard.againstNullOrUndefinedBulk([
			{ value: properties.page, field: 'page' },
			{ value: properties.count, field: 'count' }
		])

		if (nullUndefinedGuard.fail) {
			return left(nullUndefinedGuard.fields.map(field => new RequiredViolation(field)))
		}

		const typeGuard = Guard.isOfTypeBulk('number', [
			{ value: properties.page, field: 'page' },
			{ value: properties.count, field: 'count' }
		])

		if (typeGuard.fail) {
			return left(typeGuard.fields.map(field => new WrongTypeViolation(field)))
		}

		const isValid = this.isValidBulk(properties as PaginationValueObjectProperties)

		if (isValid.fail) {
			return left(isValid.fields.map(field => new WrongFormatViolation(field)))
		}

		return right(new PaginationValueObject(properties as PaginationValueObjectProperties))
	}
}
