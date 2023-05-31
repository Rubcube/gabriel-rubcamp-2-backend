import { InvalidJWTTokenError } from 'common/errors/InvalidJWTTokenError'
import { Either } from 'common/seedword/core/Either'

import { User } from 'modules/identity/domain/user/User'
import { Account } from 'modules/identity/domain/account/Account'
import { IAuthTokenPayload } from './IAuthTokenPayload'
import { IResetTokenPayload } from './IResetTokenPayload'

export type ITokenProvider = {
	decodeAuthToken: (token: string) => Either<InvalidJWTTokenError, IAuthTokenPayload>
	decodeResetToken: (token: string) => Either<InvalidJWTTokenError, IResetTokenPayload>
	signUserToken: (user: User, account: Account) => string
	signUserResetToken: (user: User) => string
}
