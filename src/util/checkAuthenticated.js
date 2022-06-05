export function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/login')
}

export function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/')
}