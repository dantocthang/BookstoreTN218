import bcrypt from 'bcrypt'
import User from '../models/User.js'


import { multipleMongooseToObject } from '../../util/mongoose.js'



class HomeController {
    index(req, res, next) {
        const courses = res.paginatedResult
        console.log(req?.user?.username)
        res.render('home', { courses: multipleMongooseToObject(courses.data), courseSibling: courses, username: req?.user?.username})
    }


    // [GET] /register
    register(req, res, next) {
        if (req.session.User)
            return res.redirect('/')
        return res.render('auth/register')
    }


    // [POST] /register
    async addUser(req, res, next) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({ username: req.body.username, password: hashedPassword })
            console.log(user)
            user.save()
                .then(() => res.redirect('/login'))
                .catch(next)
        }
        catch {
            return res.redirect('/register')
        }
    }

    // [GET] /login
    login(req, res, next) {
        if (req.session.User)
            return res.redirect('/')
        return res.render('auth/login', { error: req.flash('error')} )
    }
    

    // [POST] /login
    async signIn(req, res, next) {
        const user = await User.find({ username: req.body.username })
        if (user) {
            if (bcrypt.compare(req.body.password, user.password)) res.json({ message: 'Authenticated' })
            else res.json({ err: 'Password incorrect' })
        }

        return res.redirect('/')
    }

    logout(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/login');
          });
    }


}

const a = new HomeController()

export default a