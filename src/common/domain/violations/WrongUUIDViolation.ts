import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class WrongUUIViolation extends Violation {
	constructor(field: string) {
		super({
			code: ViolationCodes.WRONG_UUID_FORMAT,
			field
		})
	}
}
