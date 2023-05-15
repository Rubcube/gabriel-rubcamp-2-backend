import { container } from 'tsyringe'
import './providers/token'

import { IUserRepository } from 'modules/users/domain/user/IUserRepository'
import { PrismaUserRepository } from 'modules/users/repositories/PrismaUserRepository'

import { IAccountRepository } from 'modules/users/domain/account/IAccountRepository'
import { PrismaAccountRepository } from 'modules/users/repositories/PrismaAccountRepository'

container.registerSingleton<IUserRepository>('UserRepository', PrismaUserRepository)

container.registerSingleton<IAccountRepository>('AccountRepository', PrismaAccountRepository)
