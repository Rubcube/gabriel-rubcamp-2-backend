import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'
import { AccountController } from '../controllers/AccountController'

const accountRouter = Router()
const accountController = new AccountController()

accountRouter.use(ensureAuthentication)
accountRouter.get('/:account_id/balance', accountController.getBalance)
accountRouter.get('/:account_id/statement', accountController.getStatement)

export { accountRouter }
