function authRole(req, res, next) {
    if (req.session.User.role == "Admin") {
        return next()
    }
    return res.json({ error: 'Access denied' })
}

export default authRole