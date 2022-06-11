import express from 'express'
// import { check } from 'express-validator'
const router = express.Router()

import courseController from '../app/controllers/CourseController.js'
import {courseValidator} from '../util/dataValidator.js'


router.get('/create', courseController.create)
router.post('/store',...courseValidator, courseController.store)
router.post('/handle-action',courseController.action)
router.get('/:slug', courseController.show)
router.get('/:id/edit', courseController.edit)
router.put('/:id', courseController.update)
router.patch('/:id/restore', courseController.restore)
router.delete('/:id', courseController.delete)
router.delete('/:id/permanent', courseController.destroy)
router.get('/',courseController.index)

export default router