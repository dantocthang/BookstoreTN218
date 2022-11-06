import CartDetail from '../models/cart-detail.js'
import vnPayParams from '../../util/vnPayParams.js'
import dateFormat, { masks } from "dateformat";
// import sortObject from 'sort-object';
import sortObject from '../../util/sortObject.js'
import querystring from 'qs';
import * as crypto from 'crypto';
import Address from '../models/address.js'
import Book from '../models/book.js'
import Order from '../models/order.js';

class CartController {
    // [GET] /cart
    async cart(req, res, next) {
        const user = req.session.user || req.user
        try {
            const cartDetails = await CartDetail.findAll({
                where: { userId: user.id }, include: [
                    { model: Book, as: 'book', include: ['images'] }
                ]
            })
            return res.render('guest/cart/cart', { layout: null, cartDetails })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /cart?replace
    async addToCart(req, res, next) {
        const user = req.session.user || req.user
        if (!user) return res.json({ success: false })
        const quantity = req.body?.quantity || 1
        try {
            if (req.query.hasOwnProperty('replace')) {
                await CartDetail.update({ quantity: quantity }, { where: { id: req.body.id } })
            }
            else {
                const item = await CartDetail.findOne({ where: { userId: user.id, bookId: req.body.bookId } })
                if (item) {
                    item.quantity += parseInt(quantity)
                    await item.save()
                } else {
                    await CartDetail.create({ userId: user.id, bookId: req.body.bookId, quantity })
                }
            }

            return res.json({ success: true })
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
            const cartItems = await CartDetail.findAll({
                where: { userId: user.id }, include: [{
                    model: Book, as: 'book', include: ['images']
                }]
            })
            const addresses = await Address.findAll({ where: { userId: user.id } })
            return res.render('guest/cart/checkout', { cartItems, addresses })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /cart/checkout
    async checkout(req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }

    async showPaymentForm(req, res, next) {
        const user = req.session.user || req.user
        try {
            return res.render('guest/cart/payment')
        } catch (error) {
            next(error)
        }
    }

    async processPayment(req, res, next) {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const user = req.session.user || req.user
        const cartItems = await CartDetail.findAll({ where: { userId: user.id }, include: ['book'] })
        const amount = cartItems.reduce((total, item) => {
            return total += item.quantity * item.book.price
        }, 0)

        // Create new profile if not exist
        const profile = await Address.findOne({ where: { address: req.body.address, phone: req.body.phone } })
        if (!profile) {
            await Address.create({ address: req.body.address, phone: req.body.phone, userId: user.id, name: 'New profile' })
        }


        var tmnCode = vnPayParams['vnp_TmnCode'];
        var secretKey = vnPayParams['vnp_HashSecret'];
        var vnpUrl = vnPayParams['vnp_Url'];
        var returnUrl = vnPayParams['vnp_ReturnUrl'];

        var date = new Date();

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        // var amount = req.body.amount;
        var bankCode = '';

        var orderInfo = 'Online payment';
        var orderType = 'billpayment';
        var locale = 'vn';
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);
        console.log(vnp_Params);

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        // console.log(vnpUrl)
        res.redirect(vnpUrl)
    }

    async paymentReturn(req, res, next) {
        var vnp_Params = req.query;

        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        // var config = require('config');
        // var tmnCode = config.get('vnp_TmnCode');
        var secretKey = vnPayParams.vnp_HashSecret;

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            let resData = await Order.create({
                total: vnp_Params.vnp_Amount,
                paymentStatus: vnp_Params.vnp_TransactionStatus,
                transactionId: vnp_Params.vnp_TransactionNo,
                paymentMethod: vnp_Params.vnp_CardType,
                transdate: vnp_Params.vnp_PayDate
            });

            if (resData) {
            }
            res.render('guest/cart/payment_infor', { errCode: 0, data: vnp_Params })
        } else {
            res.render('guest/cart/payment_infor', { errCode: -1 })
        }
    }
}

export default new CartController