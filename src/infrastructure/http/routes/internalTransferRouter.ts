import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'
import { InternalTransferController } from '../controllers/InternalTransferController'

const internalTransferRouter = Router()
const internalTransferController = new InternalTransferController()

internalTransferRouter.use(ensureAuthentication)
internalTransferRouter.post('/', internalTransferController.create)

export { internalTransferRouter }
