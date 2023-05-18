import { sign, verify } from 'jsonwebtoken'

import { TokenPayload } from '../ITokenPayload'
import { ITokenProvider } from '../ITokenProvider'
import { User } from 'modules/identity/domain/user/User'

import { authentication } from 'config/authentication'
import { Account } from 'modules/identity/domain/account/Account'

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
						subject: String(data.sub),
						account_id: String(data.account_id)
					})
					return
				}

				reject(data)
			})
		})
	}

	public signUserToken(user: User, account: Account): string {
		return sign({ account_id: account.id.value }, authentication.secret, {
			subject: user.id.value,
			expiresIn: '31d'
		})
	}
}
