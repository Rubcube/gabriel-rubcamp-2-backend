import { type Violation } from 'src/common/seedword/domain/Violation'
import { type AppErrorCodes } from 'src/common/seedword/errors/AppErrorCodes'

export interface HTTPError {
	code: AppErrorCodes
	message: string
	violations?: Violation[]
}
