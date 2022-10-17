
class HomeController {
    index(req, res, next) {
        return res.render('home')
    }
}

export default new HomeController()