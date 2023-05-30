import {
	IVerificationProvider,
	SendVerificationInput,
	CheckVerificationInput,
	Channel
} from '../../IVerificationProvider'

type Verification = {
	to: string
	channel: Channel
	code: string
}

export class InMemoryVerificationProvider implements IVerificationProvider {
	verifications: Verification[] = []

	async sendVerification(input: SendVerificationInput): Promise<boolean> {
		this.verifications.push({
			to: input.to,
			channel: input.channel,
			code: Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')
		})

		return true
	}

	async checkVerification(input: CheckVerificationInput): Promise<Channel | undefined> {
		const check = this.verifications.find(value => value.to === input.to && value.code === input.code)

		return check ? check.channel : undefined
	}
}
