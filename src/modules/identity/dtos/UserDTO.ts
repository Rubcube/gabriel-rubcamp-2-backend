import { AddressDTO } from './AddressDTO'

export type UserPhoneDTO = {
	country_code: string
	area_code: string
	number: string
}

export type UserDTO = {
	id: string
	name: string
	email: string
	birthday: string
	phone: UserPhoneDTO
	document: string
	address: AddressDTO
	is_phone_verified: boolean
	is_email_verified: boolean
	created_at?: string
	updated_at?: string
}
