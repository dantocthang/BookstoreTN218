
class HomeController {
    index(req, res, next) {
        return res.render('guest/home', {layout: 'guest/layouts/main'})
    }
}

export default new HomeController()