import { Router } from 'express'

import { AuthenticateController } from '../controllers/AuthenticationController'

const authRouter = Router()
const authenticateController = new AuthenticateController()

authRouter.post('/login', authenticateController.create)

export { authRouter }
