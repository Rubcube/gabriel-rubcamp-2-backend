import moment from 'moment'
import { faker } from '@faker-js/faker'
import { cpf } from 'cpf-cnpj-validator'

import { generatePassword, generateTransactionalPassword } from '../generatePassword'

export function userMock() {
	return {
		name: faker.person.fullName(),
		email: faker.internet.email(),
		birthday: moment().format('YYYY-MM-DD'),
		phone: {
			country_code: '55',
			area_code: '11',
			number: faker.phone.number('9########')
		},
		document: cpf.generate(),
		password: generatePassword(),
		transactional_password: generateTransactionalPassword(),
		address: {
			zipcode: faker.location.zipCode('########'),
			city: faker.location.city(),
			state: faker.location.state({ abbreviated: true }),
			street: faker.location.street(),
			number: faker.location.buildingNumber(),
			complement: faker.location.secondaryAddress(),
			neighborhood: faker.location.county()
		}
	}
}
