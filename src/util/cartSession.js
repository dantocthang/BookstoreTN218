import Course from '../app/models/Course.js'

export async function cartSession(req, res, next) {
    if (req.session?.cart) {
        var cart = req.session.cart || []
        var detailCart = []
        if (cart != []) {
            for (let i = 0; i < cart.length; i++) {
                const course = await Course.findById(cart[i].id)
                detailCart.push({ id: course._id, name: course.name, image: course.image, count: cart[i].count })
            }
        }
        res.locals.cartItems = detailCart
        // console.log(res.locals.cartItems)
    }
    return next();
}