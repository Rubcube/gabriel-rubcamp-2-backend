import { TokenPayload } from './ITokenPayload'
import { User } from 'modules/identity/domain/user/User'
import { Account } from 'modules/identity/domain/account/Account'

export type ITokenProvider = {
	decodeAuthToken: (token: string) => Promise<TokenPayload>
	decodeResetToken: (token: string) => Promise<TokenPayload>
	signUserToken: (user: User, account: Account) => string
	signUserResetToken: (user: User) => string
}
