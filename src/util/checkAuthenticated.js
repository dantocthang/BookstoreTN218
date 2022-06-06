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

export function fetchUserInfo(req, res, next) {
    if (req?.user?.username)
        res.locals.username = req.user.username;
    return next();
}