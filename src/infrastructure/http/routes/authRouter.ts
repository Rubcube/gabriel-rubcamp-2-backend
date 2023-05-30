import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'

import { AuthenticateController } from '../controllers/AuthenticationController'

const authRouter = Router()
const authenticateController = new AuthenticateController()

authRouter.post('/login', authenticateController.create)
authRouter.post('/forgot-password/:document', authenticateController.initForgotPassword)
authRouter.post('/reset-password/:token', authenticateController.resetPassword)

authRouter.patch('/password', ensureAuthentication, authenticateController.updatePassword)
authRouter.post('/verification', ensureAuthentication, authenticateController.sendVerificationCode)
authRouter.post('/verification-check', ensureAuthentication, authenticateController.checkVerificationCode)

export { authRouter }
