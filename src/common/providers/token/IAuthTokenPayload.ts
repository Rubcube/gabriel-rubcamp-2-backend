export type IAuthTokenPayload = {
	issued_at: number
	expires_in: number
	subject: string
	account_id: string
	type: 'auth'
}
