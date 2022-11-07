import homeRouter from './home.js'
import authRouter from './auth.js'
import cartRouter from './cart.js'
import adminRouter from './admin.js'
import bookRouter from './book.js'
import userRouter from './user.js'
// import { checkAuthenticated, checkNotAuthenticated } from '../util/checkAuthenticated.js'
// import authRole from '../util/authRole.js'

function route(app) {
    app.use('/admin', adminRouter)
    app.use('/auth', authRouter)
    app.use('/cart', cartRouter)
    app.use('/book', bookRouter)
    app.use('/user', userRouter)
    app.use('/', homeRouter)
    // 404
    app.use((req, res) => res.status(404).render('404', { layout: '404' }));
}

export default route