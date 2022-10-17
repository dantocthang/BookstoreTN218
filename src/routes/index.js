import homeRouter from './home.js'
import authRouter from './auth.js'
import cartRouter from './cart.js'
// import { checkAuthenticated, checkNotAuthenticated } from '../util/checkAuthenticated.js'
// import authRole from '../util/authRole.js'

function route(app) {
    app.use('/auth', authRouter)
    app.use('/cart', cartRouter)
    app.use('/', homeRouter)   
}

export default route