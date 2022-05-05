import express from 'express'
const router = express.Router()
import newsController from '../app/controllers/NewsController.js'

router.use('/', newsController.index)

export default router


