import { type Violation } from '../domain/Violation'
import { type AppErrorCodes } from './AppErrorCodes'

interface AppErrorProperties {
	code: AppErrorCodes
	message: string
	violations?: Violation[]
}

export abstract class AppError {
	code: AppErrorCodes
	message: string
	violations?: Violation[]

	constructor(properties: AppErrorProperties) {
		this.code = properties.code
		this.message = properties.message
		this.violations = properties.violations
	}
}
