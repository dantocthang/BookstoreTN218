class AdminController {
    // [GET] /, /home
    index(req, res, next) {
        res.render('admin/home', { layout: 'admin/layouts/main' })
    }

    //...
}

export default new AdminController()