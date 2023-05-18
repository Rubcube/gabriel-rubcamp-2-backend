import { ValueObject } from 'common/seedword/domain/ValueObject'
import { Either, left, right } from 'common/seedword/core/Either'
import { Violation } from 'common/seedword/domain/Violation'
import { Guard } from 'common/seedword/core/Guard'

import { InvalidAmountRangeViolation } from 'common/domain/violations/InvalidAmountRangeViolation'
import { RequiredViolation } from 'common/domain/violations/RequiredViolation'
import { WrongTypeViolation } from 'common/domain/violations/WrongTypeViolation'

type AmountProperties = {
	value: number
}

export class Amount extends ValueObject<AmountProperties> {
	static create(properties: AmountProperties): Either<Violation, Amount> {
		if (Guard.againstNullOrUndefined(properties.value).fail) {
			return left(new RequiredViolation('amount', properties.value.toString()))
		}

		if (Guard.isOfType('number', properties.value).fail) {
			return left(new WrongTypeViolation('amount', properties.value.toString()))
		}

		if (properties.value <= 0) {
			return left(new InvalidAmountRangeViolation(properties.value.toString()))
		}

		return right(new Amount({ value: properties.value }))
	}
}
