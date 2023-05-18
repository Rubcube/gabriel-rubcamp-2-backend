import { Chance } from 'chance'

const chance = Chance()

export function generatePassword() {
	const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz'
	const uppercaseLetters = lowercaseLetters.toUpperCase()
	const specialCharacters = '!@#$&*'

	let password = ''
	password += chance.character({ pool: lowercaseLetters })
	password += chance.character({ pool: uppercaseLetters })
	password += chance.character({ pool: specialCharacters })
	password += chance.integer({ min: 10000, max: 99999 }).toString()

	return password
}

export function generateTransactionalPassword() {
	return chance.integer({ min: 1000, max: 9999 }).toString()
}
