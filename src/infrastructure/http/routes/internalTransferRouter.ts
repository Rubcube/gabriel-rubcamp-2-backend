import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'
import { InternalTransferController } from '../controllers/InternalTransferController'

const internalTransferRouter = Router()
const internalTransferController = new InternalTransferController()

internalTransferRouter.post('/', ensureAuthentication, internalTransferController.create)
internalTransferRouter.get('/:internal_transfer_id', ensureAuthentication, internalTransferController.get)

export { internalTransferRouter }
