import homeRouter from './home.js'
import courseRouter from './courses.js'
import meRouter from './me.js'
import authRouter from './auth.js'
import { checkAuthenticated, checkNotAuthenticated } from '../util/checkAuthenticated.js'
// import authRole from '../util/authRole.js'

function route(app) {
    // app.use('/courses', authRole, courseRouter)
    app.use('/courses', courseRouter)
    app.use('/me',checkAuthenticated, meRouter)
    app.use('/auth', authRouter)
    app.use('/', homeRouter)   
}

export default route