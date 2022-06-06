import express from 'express'
const router = express.Router()

import meController from '../app/controllers/MeController.js'
import Course from '../app/models/Course.js'
import paginator from '../util/paginate.js'
import {checkAuthenticated} from '../util/checkAuthenticated.js'

router.get('/stored/courses',checkAuthenticated, paginator(Course, 12), meController.storedCourses)
router.get('/trash/courses',checkAuthenticated, meController.trashCourses)

export default router