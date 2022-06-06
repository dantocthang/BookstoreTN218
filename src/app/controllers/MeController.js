import Course from '../models/Course.js'
import { multipleMongooseToObject, mongooseToObject } from '../../util/mongoose.js'

// [GET] /me/stored/courses 
class MeController {
    async storedCourses(req, res, next) {
       
        try {
            
            const deletedCount = await Course.countDocumentsDeleted()
            const courses = res.paginatedResult
            // res.json(courses)
            res.render('me/stored-courses', { courses: multipleMongooseToObject(courses.data), courseSibling: courses, deletedCount })
        }
        catch (err) {
            next()
        }
    }


    // [GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then(courses => {
                res.render('me/trash-courses', { courses: multipleMongooseToObject(courses) })
            })
            .catch(next)
    }
}
const a = new MeController()

export default a