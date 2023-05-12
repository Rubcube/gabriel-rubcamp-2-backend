import { type Request, type Response } from 'express'

import { AccountMapper } from 'modules/users/mappers/AccountMapper'
import { UserMapper } from 'modules/users/mappers/UserMapper'

import { PrismaAccountRepository } from 'modules/users/repositories/PrismaAccountRepository'
import { PrismaUserRepository } from 'modules/users/repositories/PrismaUserRepository'
import { CreateOnboardingService } from 'modules/users/service/OnboardingService'

const userRepository = new PrismaUserRepository()
const accountRepository = new PrismaAccountRepository()

const service = new CreateOnboardingService(userRepository, accountRepository)

export const onboardingController = {
	async create(request: Request, response: Response): Promise<void> {
		const { name, email, birthday, document, password, transactional_password } = request.body
		const phone = Object(request.body.phone)
		const address = Object(request.body.address)

		const result = await service.execute({
			name,
			email,
			birthday,
			phone,
			document,
			password,
			transactional_password,
			address: {
				zipcode: address.zipcode,
				city: address.city,
				state: address.state,
				street: address.street,
				number: address.number,
				complement: address.complement,
				neighborhood: address.neighborhood
			}
		})

		if (result.isRight()) {
			response.status(201).json({
				user: UserMapper.toDTO(result.value.user),
				account: AccountMapper.toDTO(result.value.account)
			})

			return
		}

		response.status(400).send(result.value)
	}
}
