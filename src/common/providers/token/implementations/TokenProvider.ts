import { sign, verify } from 'jsonwebtoken'

import { authentication, reset } from 'config/token'

import { TokenPayload } from '../ITokenPayload'
import { ITokenProvider } from '../ITokenProvider'
import { User } from 'modules/identity/domain/user/User'
import { Account } from 'modules/identity/domain/account/Account'

async function decodePromise(token: string, secret: string): Promise<TokenPayload> {
	return await new Promise((resolve, reject) => {
		verify(token, secret, (error, data) => {
			if (error) {
				reject(error)
				return
			}

			if (data && typeof data !== 'string') {
				resolve({
					issued_at: Number(data.iat),
					expires_in: Number(data.exp),
					subject: String(data.sub),
					account_id: String(data.account_id),
					type: data.type
				})
				return
			}

			reject(data)
		})
	})
}

export class TokenProvider implements ITokenProvider {
	public async decodeAuthToken(token: string): Promise<TokenPayload> {
		return await decodePromise(token, authentication.secret)
	}

	public async decodeResetToken(token: string): Promise<TokenPayload> {
		return await decodePromise(token, reset.secret)
	}

	public signUserToken(user: User, account: Account): string {
		return sign({ account_id: account.id.value, type: 'auth' }, authentication.secret, {
			subject: user.id.value,
			expiresIn: '31d'
		})
	}

	public signUserResetToken(user: User): string {
		return sign({ type: 'reset' }, reset.secret, {
			subject: user.id.value,
			expiresIn: '10min'
		})
	}
}
