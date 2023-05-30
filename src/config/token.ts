export const authentication = {
	secret: String(process.env.JWT_AUTH_SECRET)
}

export const reset = {
	secret: String(process.env.JWT_RESET_SECRET)
}
