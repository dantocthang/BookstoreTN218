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
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.render('auth/register', { data: req.body, errors: errors.array() })
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await User.create({ email: req.body.email, password: hashedPassword, fullName: req.body.fullName })
            return res.redirect('/auth/login')
        } catch (error) {
            next(error)
        }
    }

    // [GET] /login
    login(req, res, next) {
        if (req.session.user)
            return res.redirect('/')
        return res.render('auth/login', { errors: {}, data: {} })
    }

    // [POST] /login
    async authenticate(req, res, next) {
        try {
            const user = await User.findOne({ where: { email: req.body.email } })
            if (!user) return res.render('auth/login', { errors: { email: 'User with that does not exist' }, data: req.body })
            const isCorrectPassword = await bcrypt.compare(req.body.password, user.password)
            if (!isCorrectPassword) return res.render('auth/login', { errors: { password: 'Password is not correct' }, data: req.body })
            req.session.user = user.dataValues
            return res.redirect('/')
        } catch (error) {
            next(error)
        }
    }

    // [GET] /auth/logout
    logout(req, res, next) {
        req.session.destroy();
        return res.redirect('/')
    }
}

export default new AuthController()