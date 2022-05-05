import Course from '../models/Course.js'
import { multipleMongooseToObject } from '../../util/mongoose.js'

class HomeController{
    index(req, res, next){
        Course.find({})
            .then(courses=>{
                res.render('home', {courses: multipleMongooseToObject(courses)})
            })
            .catch(next)
    }
}

const a = new HomeController()

export default a