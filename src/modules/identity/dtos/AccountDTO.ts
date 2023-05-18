export type AccountDTO = {
	id: string
	user_id: string
	balance: number
	account: string
	agency: string
	status: string
	created_at?: string
	updated_at?: string
	closed_at: string | null
	blocked_at: string | null
}
