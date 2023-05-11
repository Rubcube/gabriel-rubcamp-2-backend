import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class InvalidBirthdayViolation extends Violation {
	constructor(value: string) {
		super({
			code: ViolationCodes.INVALID_BIRTHDAY,
			field: 'birthday',
			value
		})
	}
}
