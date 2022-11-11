import express from 'express'
import CartController from '../app/controllers/CartController.js'
import { checkAuthenticated } from '../util/checkAuthenticated.js'

const router = express.Router()

router.get('/', checkAuthenticated, CartController.cart)
router.get('/simple', CartController.cartSimple)
router.post('/', checkAuthenticated, CartController.addToCart)
router.delete('/', checkAuthenticated, CartController.deleteCartItem)
router.get('/checkout', checkAuthenticated, CartController.checkoutForm)
router.get('/create_payment_url', CartController.showPaymentForm)
router.post('/create_payment_url', CartController.processPayment);
router.get('/payment_return', CartController.paymentReturn);

export default router