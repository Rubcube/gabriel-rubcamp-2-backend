import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'

import { AccountController } from '../controllers/AccountController'

const accountRouter = Router()
const accountController = new AccountController()

accountRouter.get('/balance', ensureAuthentication, accountController.getBalance)
accountRouter.get('/statement', ensureAuthentication, accountController.getStatement)

export { accountRouter }
