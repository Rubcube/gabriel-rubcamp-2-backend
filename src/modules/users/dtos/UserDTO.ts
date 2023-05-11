import { type AddressDTO } from './AddressDTO'

export interface UserPhoneDTO {
	country_code: string
	area_code: string
	number: string
}

export interface UserDTO {
	id: string
	name: string
	email: string
	birthday: string
	phone: UserPhoneDTO
	document: string
	address: AddressDTO
	created_at: string
	updated_at: string
}
