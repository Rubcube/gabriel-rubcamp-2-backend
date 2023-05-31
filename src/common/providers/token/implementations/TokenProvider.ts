import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { Either, left, right } from 'common/seedword/core/Either'

import { tokensConfig } from 'config/token'
import { InvalidJWTTokenError } from 'common/errors/InvalidJWTTokenError'

import { ITokenProvider } from '../ITokenProvider'
import { IAuthTokenPayload } from '../IAuthTokenPayload'
import { IResetTokenPayload } from '../IResetTokenPayload'

import { User } from 'modules/identity/domain/user/User'
import { Account } from 'modules/identity/domain/account/Account'

export class TokenProvider implements ITokenProvider {
	public decodeAuthToken(token: string): Either<InvalidJWTTokenError, IAuthTokenPayload> {
		try {
			const decodedToken = verify(token, tokensConfig.authSecret) as JwtPayload

			return right({
				issued_at: Number(decodedToken.iat),
				expires_in: Number(decodedToken.exp),
				subject: String(decodedToken.sub),
				account_id: String(decodedToken.account_id),
				type: decodedToken.type
			})
		} catch (error) {
			return left(new InvalidJWTTokenError())
		}
	}

	public decodeResetToken(token: string): Either<InvalidJWTTokenError, IResetTokenPayload> {
		try {
			const decodedToken = verify(token, tokensConfig.resetSecret) as JwtPayload

			return right({
				issued_at: Number(decodedToken.iat),
				expires_in: Number(decodedToken.exp),
				subject: String(decodedToken.sub),
				account_id: String(decodedToken.account_id),
				type: decodedToken.type
			})
		} catch (error) {
			return left(new InvalidJWTTokenError())
		}
	}

	public signUserToken(user: User, account: Account): string {
		return sign({ account_id: account.id.value, type: 'auth' }, tokensConfig.authSecret, {
			subject: user.id.value,
			expiresIn: '31d'
		})
	}

	public signUserResetToken(user: User): string {
		return sign({ type: 'reset' }, tokensConfig.resetSecret, {
			subject: user.id.value,
			expiresIn: '10min'
		})
	}
}
