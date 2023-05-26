import { ViolationCodes } from './ViolationCodes'

type ViolationProperties = {
	code: ViolationCodes
	field: string
	value?: string
	message?: string
	expectedValues?: string[] | number[]
}

export abstract class Violation {
	public code: ViolationCodes
	public field: string
	public value?: string
	public message?: string
	public expectedValues?: string[] | number[]

	constructor(properties: ViolationProperties) {
		this.code = properties.code
		this.field = properties.field
		this.value = properties.value
		this.message = properties.message
		this.expectedValues = properties.expectedValues
	}
}
