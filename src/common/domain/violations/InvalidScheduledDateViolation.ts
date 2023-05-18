import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class InvalidScheduledDateViolation extends Violation {
	constructor(field: string, value: string) {
		super({
			code: ViolationCodes.INVALID_SCHEDULED_DATE,
			field,
			value
		})
	}
}
