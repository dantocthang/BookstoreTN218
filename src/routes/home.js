import express from 'express'
import passport from 'passport'

import homeController from '../app/controllers/HomeController.js'
import Course from '../app/models/Course.js'
import paginator from '../util/paginate.js'
import {checkAuthenticated, checkNotAuthenticated} from '../util/checkAuthenticated.js'

const router = express.Router()


router.get('/login',checkNotAuthenticated, homeController.login)
router.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login', 
    failureFlash : true
}))
router.get('/register', homeController.register)
router.post('/register', homeController.addUser)
router.delete('/logout', homeController.logout)
router.use('/', checkAuthenticated, paginator(Course, 12), homeController.index)  

export default router