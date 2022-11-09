export default function(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/auth/login');
    }

    next();
}