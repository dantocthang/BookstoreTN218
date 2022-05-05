import Course from '../models/Course.js'

class NewsController{
    index(req, res, next){
        Course.find({})
            .then(courses=>res.json(courses))
            .catch(next)
    }

}

const a = new NewsController()

export default a