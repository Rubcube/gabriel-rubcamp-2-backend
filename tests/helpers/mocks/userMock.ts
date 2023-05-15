import { faker } from '@faker-js/faker'

export function userMock() {
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		birthday: '1998-10-04',
		phone: {
			country_code: '55',
			area_code: '11',
			number: '997659306'
		},
		document: '15762348008',
		password: '12345678aA!',
		transactional_password: '1234'
	}
}
