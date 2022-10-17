import express from 'express'
import CartController from '../app/controllers/CartController.js'
import { checkAuthenticated } from '../util/checkAuthenticated.js'

const router = express.Router()

router.get('/', checkAuthenticated, CartController.cart)
router.post('/', checkAuthenticated, CartController.addToCart)
router.delete('/', checkAuthenticated, CartController.deleteCartItem)
router.get('/checkout', checkAuthenticated, CartController.checkoutForm)

export default router