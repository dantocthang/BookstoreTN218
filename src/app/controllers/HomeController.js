
class HomeController {
    index(req, res, next) {
        // res.json(req.flash().hasOwnProperty('success'))

        res.render('home')
    }
}

const a = new HomeController()

export default a