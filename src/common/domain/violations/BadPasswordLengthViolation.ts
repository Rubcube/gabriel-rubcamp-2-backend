import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class BadPasswordLengthViolation extends Violation {
	constructor(field: string, value: string) {
		super({
			code: ViolationCodes.BAD_PASSWORD_LENGTH,
			field,
			value
		})
	}
}
