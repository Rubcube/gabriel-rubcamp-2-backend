export type InternalTranferDTO = {
	id: string
	sender_account_id: string
	recipient_account_id: string
	amount: number
	status: string
	scheduled_to: string | null
	created_at?: string
	updated_at?: string
}
