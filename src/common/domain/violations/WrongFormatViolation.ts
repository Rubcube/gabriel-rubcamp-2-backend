import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class WrongFormatViolation extends Violation {
	constructor(field: string) {
		super({
			code: ViolationCodes.WRONG_FORMAT,
			field
		})
	}
}
