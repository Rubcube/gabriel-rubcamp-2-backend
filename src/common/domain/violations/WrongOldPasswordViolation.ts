import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class WrongOldPasswordViolation extends Violation {
	constructor() {
		super({
			code: ViolationCodes.WRONG_OLD_PASSWORD,
			field: 'old_password'
		})
	}
}
