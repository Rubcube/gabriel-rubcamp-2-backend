import { Router } from 'express'

import { ensureAuthentication } from '../middlewares/ensureAuthentication'

import { ProfileController } from '../controllers/ProfileController'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.get('/', ensureAuthentication, profileController.get)

export { profileRouter }
