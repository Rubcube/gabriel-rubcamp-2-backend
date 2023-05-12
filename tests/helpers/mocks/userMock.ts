import { faker } from '@faker-js/faker'

export function userMock() {
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		birthday: '10-03-2001',
		phone: {
			country_code: '55',
			area_code: '11',
			number: '997659306'
		},
		document: '12345678901',
		password: '12345678aA!',
		transactional_password: '1234'
	}
}
