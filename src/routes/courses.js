import express from 'express'
const router = express.Router()
import courseController from '../app/controllers/CourseController.js'

router.get('/create', courseController.create)
router.post('/store',courseController.store)
router.get('/:slug', courseController.show)
router.get('/',courseController.index)

export default router