import { type ViolationCodes } from './ViolationCodes'

interface ViolationProperties {
	code: ViolationCodes
	field: string
	value?: string
	message?: string
}

export class Violation {
	public code: ViolationCodes
	public field: string
	public value?: string
	public message?: string

	constructor(properties: ViolationProperties) {
		this.code = properties.code
		this.field = properties.field
		this.value = properties.value
		this.message = properties.message
	}
}
