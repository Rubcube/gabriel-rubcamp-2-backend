import { Violation } from 'src/common/seedword/domain/Violation'
import { ViolationCodes } from 'src/common/seedword/domain/ViolationCodes'

export class BadPasswordFormatViolation extends Violation {
	constructor(field: string, value: string) {
		super({
			code: ViolationCodes.BAD_PASSWORD_FORMAT,
			field,
			value
		})
	}
}
