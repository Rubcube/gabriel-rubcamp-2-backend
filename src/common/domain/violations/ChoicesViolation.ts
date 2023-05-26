import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class ChoicesViolation extends Violation {
	constructor(field: string, value: string, expectedValues: string[] | number[]) {
		super({
			code: ViolationCodes.CHOICES,
			field,
			value,
			expectedValues
		})
	}
}
