import { Violation } from 'src/common/seedword/domain/Violation'
import { ViolationCodes } from 'src/common/seedword/domain/ViolationCodes'

export class RequiredViolation extends Violation {
	constructor(field: string, value?: string) {
		super({
			code: ViolationCodes.REQUIRED,
			field,
			value
		})
	}
}
