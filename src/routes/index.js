import homeRouter from './home.js'
import authRouter from './auth.js'
import userRouter from './user.js'
import bookRouter from './book.js'
// import { checkAuthenticated, checkNotAuthenticated } from '../util/checkAuthenticated.js'
// import authRole from '../util/authRole.js'

function route(app) {
    app.use('/book-list', bookRouter) 
    app.use('/user', userRouter) 
    app.use('/auth', authRouter)
    app.use('/', homeRouter)  
}

export default route