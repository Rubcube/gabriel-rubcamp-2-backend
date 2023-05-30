type VerificationConfig = {
	driver: 'twilio' | 'in-memory'
}

export const verificationConfig: VerificationConfig = {
	driver: process.env.VERIFICATION_PROVIDER_DRIVER === 'twilio' ? 'twilio' : 'in-memory'
}
