import { TokenPayload } from './ITokenPayload'
import { User } from 'modules/users/domain/user/User'

export type ITokenProvider = {
	decodeToken: (token: string) => Promise<TokenPayload>
	signUserToken: (user: User) => string
}
