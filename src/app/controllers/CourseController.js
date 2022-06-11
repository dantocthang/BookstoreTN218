
import Course from '../models/Course.js'
import {validationResult} from 'express-validator'
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

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create',{data: {}, errors: {}},)
    }

    // [POST] /courses/create
    store(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.render('courses/create',{data: req.body, errors: errors.array() });
        }
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`
        // req.body.slug = nanoid(10)
        const course = new Course(req.body)
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next)
    }

    // [GET] /course/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit', { course: mongooseToObject(course) }))
            .catch(next)
    }

    // [PUT] /courses/:id
    update(req, res, next) {
        Course.findByIdAndUpdate(req.params.id, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next)
    }

    //[DELETE] /courses/:id
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [DELETE] /courses/:id/permanent
    destroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [POST] /courses/handle-action
    action(req, res, next) {
        console.log(req.body.action)
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next)
                break
            default:
                res.json({ message: 'Error' })
        }
    }
}

const a = new CourseController()

export default a