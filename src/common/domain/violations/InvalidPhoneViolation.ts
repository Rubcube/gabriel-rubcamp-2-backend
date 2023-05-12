import { Violation } from 'src/common/seedword/domain/Violation'
import { ViolationCodes } from 'src/common/seedword/domain/ViolationCodes'

export class InvalidPhoneViolation extends Violation {
	constructor() {
		super({
			code: ViolationCodes.INVALID_PHONE,
			field: 'phone'
		})
	}
}
