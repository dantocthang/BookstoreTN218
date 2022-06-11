import { multipleMongooseToObject } from '../../util/mongoose.js'

class HomeController {
    index(req, res, next) {
        const courses = res.paginatedResult
        console.log(req?.user?.username)
        // res.json(req.flash().hasOwnProperty('success'))

        res.render('home', { courses: multipleMongooseToObject(courses.data), courseSibling: courses, username: req?.user?.username, layout: '../../resourses/views/layouts/footerless.ejs', messages: req.flash()})
    }
}

const a = new HomeController()

export default a