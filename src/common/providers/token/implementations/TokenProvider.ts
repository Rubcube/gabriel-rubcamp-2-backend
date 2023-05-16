import { sign, verify } from 'jsonwebtoken'

import { TokenPayload } from '../ITokenPayload'
import { ITokenProvider } from '../ITokenProvider'
import { User } from 'modules/users/domain/user/User'

import { authentication } from 'config/authentication'

export class TokenProvider implements ITokenProvider {
	public async decodeToken(token: string): Promise<TokenPayload> {
		return await new Promise((resolve, reject) => {
			verify(token, authentication.secret, (error, data) => {
				if (error) {
					reject(error)
					return
				}

				if (data && typeof data !== 'string') {
					resolve({
						issued_at: Number(data.iat),
						expires_in: Number(data.exp),
						subject: String(data.sub)
					})
					return
				}

				reject(data)
			})
		})
	}

	public signUserToken(user: User): string {
		return sign({}, authentication.secret, {
			subject: user.id.value,
			expiresIn: '1m'
		})
	}
}
