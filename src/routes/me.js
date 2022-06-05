import express from 'express'
const router = express.Router()

import meController from '../app/controllers/MeController.js'
import Course from '../app/models/Course.js'
import paginator from '../util/paginate.js'

router.get('/stored/courses',paginator(Course, 12), meController.storedCourses)
router.get('/trash/courses', meController.trashCourses)

export default router