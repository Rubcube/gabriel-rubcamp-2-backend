import { container } from 'tsyringe'

import '../providers'

import { IUserRepository } from 'modules/identity/domain/user/IUserRepository'
import { PrismaUserRepository } from 'modules/identity/repositories/prisma/PrismaUserRepository'

import { IAccountRepository } from 'modules/identity/domain/account/IAccountRepository'
import { PrismaAccountRepository } from 'modules/identity/repositories/prisma/PrismaAccountRepository'

import { ITransactionRepository } from 'modules/transactions/domain/transaction/ITransactionRepository'
import { PrismaTransactionRepository } from 'modules/transactions/repositories/PrismaTransactionRepository'

import { IInternalTransferRepository } from 'modules/transactions/domain/internal_transfer/IInternalTransferRepository'
import { PrismaInternalTransferRepository } from 'modules/transactions/repositories/PrismaInternalTransferRepository'

container.registerSingleton<IUserRepository>('UserRepository', PrismaUserRepository)

container.registerSingleton<IAccountRepository>('AccountRepository', PrismaAccountRepository)

container.registerSingleton<ITransactionRepository>('TransactionRepository', PrismaTransactionRepository)
container.registerSingleton<IInternalTransferRepository>('InternalTransferRepository', PrismaInternalTransferRepository)
