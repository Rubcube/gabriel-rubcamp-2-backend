import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class InvalidEmailViolation extends Violation {
	constructor(value: string) {
		super({
			code: ViolationCodes.INVALID_EMAIL,
			field: 'email',
			value
		})
	}
}
