export type SendVerificationInput = {
	to: string
	channel: 'phone' | 'email'
	substitutions: {
		name: string
	}
}

export type CheckVerificationInput = {
	to: string
	code: string
}

export type IVerificationProvider = {
	sendVerification: (input: SendVerificationInput) => Promise<boolean>
	checkVerification: (input: CheckVerificationInput) => Promise<boolean>
}
