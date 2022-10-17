import CartDetail from '../models/cart-detail.js'
class CartController {
    // [GET] /cart
    async cart(req, res, next) {
        const user = req.session.user || req.user
        try {
            const cartDetails = await CartDetail.findAll({ where: { userId: user.id }, include: ['book'] })
            return res.render('guest/cart/cart', {layout: null, cartDetails })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /cart?replace&bookId=&quantity=?
    async addToCart(req, res, next) {
        const user = req.session.user || req.user
        const quantity = req.body?.quantity || 1
        try {
            if (req.query.hasOwnProperty('replace')) {
                await CartDetail.update({ quantity: quantity }, { where: { id: req.body.id } })
            }
            else {
                const item = await CartDetail.findOne({ where: { userId: user.id, quantity: quantity } })
                if (item) {
                    const item = await CartDetail.findOne({ where: { userId: user.id, bookId: req.body.bookId } })
                    item.quantity += parseInt(quantity)
                    await item.save()
                } else {
                    await CartDetail.create({ userId: user.id, bookId: req.body.bookId, quantity })
                }
            }

            return res.json({ success: true, message: 'Cart updated' })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /cart
    async deleteCartItem(req, res, next) {
        try {
            const item = await CartDetail.findByPk(req.query.id)
            await item.destroy()
            return res.json({ success: true, message: 'Deleted' })
        } catch (error) {
            next(error)
        }
    }

    // [GET] /cart/checkout
    async checkoutForm(req, res, next) {
        const user = req.session.user || req.user
        try {
            const cartItems = await CartDetail.findAll({ where: { userId: user.id } })
            return res.render('cart/cart', { cartItems })
        } catch (error) {
            next(error)
        }
    }
}

export default new CartController