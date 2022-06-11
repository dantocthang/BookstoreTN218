export function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/auth/login')
}

export function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }

    return res.redirect('/')
}

export function fetchUserInfo(req, res, next) {
    if (req?.user?.username){
        res.locals.username = req.user.username;
        res.locals.image = req.user.image;
    }
    return next();
}