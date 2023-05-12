import { type Request, type Response } from 'express'

import { TokenProvider } from 'src/common/providers/implementations/TokenProvider'
import { PrismaAccountRepository } from 'modules/users/repositories/PrismaAccountRepository'
import { PrismaUserRepository } from 'modules/users/repositories/PrismaUserRepository'

import { AccountMapper } from 'modules/users/mappers/AccountMapper'
import { UserMapper } from 'modules/users/mappers/UserMapper'

import { AuthenticateService } from 'modules/users/service/AuthenticateService'

export const authenticateController = {
	async create(request: Request, response: Response): Promise<void> {
		const { document, password } = request.body

		const userRepository = new PrismaUserRepository()
		const accountRepository = new PrismaAccountRepository()
		const tokenProvider = new TokenProvider()

		const service = new AuthenticateService(userRepository, accountRepository, tokenProvider)

		const result = await service.execute({
			document,
			password
		})

		if (result.isRight()) {
			response.status(201).json({
				user: UserMapper.toDTO(result.value.user),
				account: AccountMapper.toDTO(result.value.account),
				token: result.value.token
			})

			return
		}

		response.status(400).send(result.value)
	}
}
