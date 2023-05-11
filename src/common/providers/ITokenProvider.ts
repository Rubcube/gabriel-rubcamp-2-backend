import { type TokenPayload } from './ITokenPayload'
import { type User } from 'modules/users/domain/user/User'

export interface ITokenProvider {
	decodeToken: (token: string) => Promise<TokenPayload>
	signUserToken: (user: User) => string
}
