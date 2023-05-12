import { Violation } from 'src/common/seedword/domain/Violation'
import { ViolationCodes } from 'src/common/seedword/domain/ViolationCodes'

export class InvalidDocumentViolation extends Violation {
	constructor(value: string) {
		super({
			code: ViolationCodes.INVALID_DOCUMENT,
			field: 'document',
			value
		})
	}
}
