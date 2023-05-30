import { verificationConfig } from 'config/verification'

import { InMemoryVerificationProvider } from './implementations/in-memory/InMemoryVericationProvider'
import { TwilioVerificationProvider } from './implementations/twilio/TwilioVerificationProvider'

const implementations = {
	'in-memory': InMemoryVerificationProvider,
	twilio: TwilioVerificationProvider
}

export const VerificationProvider = implementations[verificationConfig.driver]
