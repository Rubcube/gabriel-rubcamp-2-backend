import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class NewPasswordEqualOldViolation extends Violation {
	constructor() {
		super({
			code: ViolationCodes.NEW_PASSWORD_EQUAL_OLD,
			field: 'new_password'
		})
	}
}
