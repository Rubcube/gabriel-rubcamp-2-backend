import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'

import { UserController } from '../controllers/UserController'

const userRouter = Router()
const userController = new UserController()

userRouter.patch('/', ensureAuthentication, userController.update)

export { userRouter }
