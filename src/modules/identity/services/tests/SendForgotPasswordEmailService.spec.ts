import { cpf } from 'cpf-cnpj-validator'

import { InMemoryEmailProvider } from 'common/providers/email/implementations/InMemoryEmailProvider'
import { InMemoryAccountRepository } from 'modules/identity/repositories/in-memory/InMemoryAccountRepository'
import { InMemoryUserRepository } from 'modules/identity/repositories/in-memory/InMemoryUserRepository'
import { TokenProvider } from 'common/providers/token/implementations/TokenProvider'

import { InvalidParameterError } from 'common/errors/InvalidParameterError'
import { ResourceNotFound } from 'common/errors/ResourceNotFoundError'

import { SendForgotPasswordEmailService } from '../SendForgotPasswordEmailService'

let accountRepository: InMemoryAccountRepository
let userRepository: InMemoryUserRepository
let emailProvider: InMemoryEmailProvider
let tokenProvider: TokenProvider
let sut: SendForgotPasswordEmailService

describe('SendForgotPasswordEmailService', () => {
	beforeEach(() => {
		accountRepository = new InMemoryAccountRepository()
		userRepository = new InMemoryUserRepository(accountRepository)
		emailProvider = new InMemoryEmailProvider()
		tokenProvider = new TokenProvider()

		sut = new SendForgotPasswordEmailService(userRepository, emailProvider, tokenProvider)
	})

	it('should not send a forgot password email with invalid document', async () => {
		const response = await sut.execute({ document: '139047384713897989' })

		expect(response.value).toBeInstanceOf(InvalidParameterError)
	})

	it('should not send a forgot password email with non-existing user', async () => {
		const response = await sut.execute({ document: cpf.generate() })

		expect(response.value).toBeInstanceOf(ResourceNotFound)
	})
})
