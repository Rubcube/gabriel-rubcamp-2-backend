import { Violation } from 'common/seedword/domain/Violation'
import { ViolationCodes } from 'common/seedword/domain/ViolationCodes'

export class InvalidDocumentViolation extends Violation {
	constructor(value: string) {
		super({
			code: ViolationCodes.INVALID_DOCUMENT,
			field: 'document',
			value
		})
	}
}
