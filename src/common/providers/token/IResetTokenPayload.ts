export type IResetTokenPayload = {
	issued_at: number
	expires_in: number
	subject: string
	type: 'reset'
}
