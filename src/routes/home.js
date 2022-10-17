import express from 'express'

import homeController from '../app/controllers/HomeController.js'
import paginator from '../util/paginate.js'
// import { checkAuthenticated, checkNotAuthenticated } from '../util/checkAuthenticated.js'

const router = express.Router()


// FOR TESTING 
router.get('/get_session', (req, res) => {
    //check session
    if (req.session.User) {
      return res.status(200).json({ status: 'success', session: req.session.User })
    }
    return res.status(200).json({ status: 'error', session: 'No session' })
  })
// END FOR TESTING

router.use('[/]', homeController.index)

export default router