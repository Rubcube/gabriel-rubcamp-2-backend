import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class WrongTypeViolation extends Violation {
	constructor(field: string, value?: string) {
		super({
			code: ViolationCodes.WRONG_TYPE,
			field,
			value
		})
	}
}
