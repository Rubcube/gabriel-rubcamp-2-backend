import { Violation } from 'src/common/seedword/domain/Violation'
import { ViolationCodes } from 'src/common/seedword/domain/ViolationCodes'

export class BadLengthViolation extends Violation {
	constructor(field: string, value: string) {
		super({
			code: ViolationCodes.BAD_LENGTH,
			field,
			value
		})
	}
}
