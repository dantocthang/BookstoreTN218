import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

import User from '../models/user.js'
import Book from '../models/book.js'


class AuthController {
    // [GET] /register
    register(req, res, next) {
        if (req.session.User)
            return res.redirect('/')
        return res.render('auth/register', { data: {}, errors: {} })
    }


    // [POST] /register
    async addUser(req, res, next) {
        // const errors = validationResult(req);
        // if (errors.isEmpty()) {
        // }
        // else return res.render('auth/register',{data: req.body, errors: errors.array()})
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({ email: req.body.email, password: hashedPassword })
        user.save()
            .then(() => res.redirect('/auth/login'))
            .catch(next)

    }

    // [GET] /login
    login(req, res, next) {
        if (req.session.User)
            return res.redirect('/')
        return res.render('auth/login', { error: req.flash('error') })
    }

    // [POST] /login
    async authenticate(req, res, next){
        console.log(req.body)
        try {
            const user = await User.findOne({where: {email: req.body.email}})
            if (!user) return res.render('auth/login', { error: 'User does not exist' })
            const isCorrectPassword =  await bcrypt.compare(req.body.password, user.password)
            console.log(isCorrectPassword)
            if (!isCorrectPassword) return res.render('auth/login', { error: 'Password is not correct' })
            req.user = user.dataValues
            return res.render('/')

        } catch (error) {
            next(error)
        }
    }
    logout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/auth/login');
        });
    }
}

const a = new AuthController()

export default a