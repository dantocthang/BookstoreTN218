import express from 'express'
import passport from 'passport'

import { checkAuthenticated, checkNotAuthenticated } from '../util/checkAuthenticated.js'
import {userValidator} from '../util/dataValidator.js'
import authController from '../app/controllers/AuthController.js'

const router = express.Router()


router.get('/login', checkNotAuthenticated, authController.login)
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    // successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
}), (req, res)=>{req.flash('success','Đăng nhập thành công'); res.redirect('/')})


// Login with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}))
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => { return res.redirect('/') });
router.get('/get-user', (req, res) => {
    res.json(req.user);
})

// Login with Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/auth/login' }),
    function (req, res) {
        res.redirect('/');
    });


router.get('/register', authController.register)
router.post('/register',...userValidator, authController.addUser)
router.delete('/logout', authController.logout)

export default router