import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class InvalidAmountRangeViolation extends Violation {
	constructor(value: string) {
		super({
			code: ViolationCodes.INVALID_AMOUNT_RANGE,
			field: 'amount',
			value
		})
	}
}
