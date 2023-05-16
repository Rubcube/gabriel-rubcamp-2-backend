import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class InvalidPhoneViolation extends Violation {
	constructor() {
		super({
			code: ViolationCodes.INVALID_PHONE,
			field: 'phone'
		})
	}
}
