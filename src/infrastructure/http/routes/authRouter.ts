import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'

import { AuthenticateController } from '../controllers/AuthenticationController'

const authRouter = Router()
const authenticateController = new AuthenticateController()

authRouter.post('/login', authenticateController.create)

authRouter.use(ensureAuthentication)

authRouter.patch('/password', authenticateController.updatePassword)

export { authRouter }
