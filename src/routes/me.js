import express from 'express'
const router = express.Router()

import meController from '../app/controllers/MeController.js'
import Course from '../app/models/Course.js'
import paginator from '../util/paginate.js'
import { checkAuthenticated } from '../util/checkAuthenticated.js'

router.get('/upload', meController.uploadForm)
router.post('/upload', meController.upload)
router.get('/images', meController.showImages)
router.get('/stored/courses', checkAuthenticated, paginator(Course, 12), meController.storedCourses)
router.get('/trash/courses', checkAuthenticated, meController.trashCourses)
router.get('/cart-minimized', checkAuthenticated, meController.cartMinimized)
router.get('/:id/add-to-cart', checkAuthenticated, meController.addToCart)

export default router