import newsRouter from './news.js'
import homeRouter from './home.js'
import courseRouter from './courses.js'

function route(app) {
    

    app.use('/news', newsRouter)
    app.use('/courses', courseRouter)
    app.use('/', homeRouter)
    

    // app.get('/', (req, res) => {
    //     res.render('home')
    // })
}

export default route