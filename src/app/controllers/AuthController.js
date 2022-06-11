import bcrypt from 'bcrypt'
import {validationResult} from 'express-validator'

import User from '../models/User.js'


class AuthController{
    // [GET] /register
    register(req, res, next) {
        if (req.session.User)
            return res.redirect('/')
        return res.render('auth/register', {data: {}, errors: {}})
    }


    // [POST] /register
    async addUser(req, res, next) {
        const errors = validationResult(req);
        // console.log(errors.array(), req.body)
        if (errors.isEmpty()) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({ username: req.body.username, email: req.body.email, password: hashedPassword })
            console.log(user)
            user.save()
                .then(() => res.redirect('/auth/login'))
                .catch(next)
        }
        else return res.render('auth/register',{data: req.body, errors: errors.array()})
        
    }

    // [GET] /login
    login(req, res, next) {
        if (req.session.User)
            return res.redirect('/')
        return res.render('auth/login', { error: req.flash('error')} )
    }

    logout(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/auth/login');
          });
    }
}

const a = new AuthController()

export default a