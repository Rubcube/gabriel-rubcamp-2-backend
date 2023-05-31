export const tokensConfig = {
	resetSecret: String(process.env.JWT_RESET_SECRET),
	authSecret: String(process.env.JWT_AUTH_SECRET)
}
