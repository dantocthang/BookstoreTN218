function authRole(req, res, next) {
    if (req.user.role == "Admin") {
        return next()
    }
    return req.flash('error','Bạn không có quyền truy cập trang này.')
}

export default authRole