import client from 'twilio'
import { ServiceContext } from 'twilio/lib/rest/verify/v2/service'

import { IVerificationProvider, SendVerificationInput, CheckVerificationInput } from '../../IVerificationProvider'

export class TwilioVerificationProvider implements IVerificationProvider {
	service: ServiceContext

	constructor() {
		this.service = client(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN).verify.v2.services(
			String(process.env.TWILIO_VERIFY_SERVICE)
		)
	}

	async sendVerification(input: SendVerificationInput): Promise<boolean> {
		try {
			await this.service.verifications.create({
				to: input.to,
				channel: input.channel === 'phone' ? 'sms' : 'email',
				channelConfiguration: {
					substitutions: input.substitutions
				}
			})

			return true
		} catch (error) {
			return false
		}
	}

	async checkVerification(input: CheckVerificationInput): Promise<boolean> {
		try {
			await this.service.verificationChecks.create({
				to: input.to,
				code: input.code
			})

			return true
		} catch (error) {
			return false
		}
	}
}
