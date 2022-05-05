
import Course from '../models/Course.js'
import { nanoid } from 'nanoid'
import { multipleMongooseToObject, mongooseToObject } from '../../util/mongoose.js'

class CourseController {
    index(req, res, next) {
        Course.find({})
            .then(courses => {
                res.render('home', { courses: multipleMongooseToObject(courses) })
            })
            .catch(next)
    }

    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(
                course => res.render('courses/show', { course: mongooseToObject(course) })
            )
            .catch(next)

    }

    create(req, res, next) {
        res.render('courses/create')

    }

    store(req, res, next) {

        const formData = req.body
        

        formData.image = `https://img.youtube.com/vi/${formData.videoId}/sddefault.jpg`
        // formData.slug = nanoid(10)
        const course = new Course(formData)
        course.save()
            .then(()=>res.redirect('/courses'))
            .catch(next)
    
    }
}

const a = new CourseController()

export default a