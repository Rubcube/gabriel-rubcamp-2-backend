import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class RequiredViolation extends Violation {
	constructor(field: string, value?: string) {
		super({
			code: ViolationCodes.REQUIRED,
			field,
			value
		})
	}
}
