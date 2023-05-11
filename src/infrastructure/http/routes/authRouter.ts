import { Router } from 'express'

import { authenticateController } from '../controllers/authenticationController'

const authRouter = Router()

authRouter.post('/login', authenticateController.create)

export { authRouter }
