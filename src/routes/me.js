import express from 'express'
const router = express.Router()

import meController from '../app/controllers/MeController.js'
import Course from '../app/models/Course.js'
import paginator from '../util/paginate.js'
import { checkAuthenticated } from '../util/checkAuthenticated.js'
import exportCsv from '../util/exportCsv.js'
import uploadFile from '../util/uploadFile.js'
import addDataFromCsv from '../util/addDataFromCsv.js'

router.get('/upload', meController.uploadForm)
// router.post('/upload', meController.upload)
router.post('/upload', uploadFile, addDataFromCsv(Course))
router.get('/images', meController.showImages)
router.get('/readCsv', meController.readCsvFile)
// router.get('/toCsv', meController.toCsv)
router.get('/toCsv', exportCsv(Course))
router.get('/stored/courses', checkAuthenticated, paginator(Course, 12), meController.storedCourses)
router.get('/trash/courses', checkAuthenticated, meController.trashCourses)
router.get('/cart-minimized', checkAuthenticated, meController.cartMinimized)
router.get('/:id/add-to-cart', checkAuthenticated, meController.addToCart)

export default router