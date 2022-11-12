import CartDetail from "../models/cart-detail.js";
import vnPayParams from "../../util/vnPayParams.js";
import dateFormat, { masks } from "dateformat";
// import sortObject from 'sort-object';
import sortObject from "../../util/sortObject.js";
import mailer from "../../util/mailer.js";
import querystring from "qs";
import * as crypto from "crypto";
import Address from "../models/address.js";
import Book from "../models/book.js";
import Order from "../models/order.js";
import OrderDetail from "../models/order-detail.js";
import User from "../models/user.js";

class CartController {
  // [GET] /cart
  async cart(req, res, next) {
    const user = req.session.user || req.user;
    try {
      const cartDetails = await CartDetail.findAll({
        where: { userId: user.id },
        include: [{ model: Book, as: "book", include: ["images"] }],
      });
      return res.render("guest/cart/cart", { layout: null, cartDetails });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /cart/simple
  async cartSimple(req, res, next) {
    const user = req.session.user || req.user;
    if (!user) return res.json([]);
    try {
      const cartDetails = await CartDetail.findAll({
        where: { userId: user.id },
        include: [{ model: Book, as: "book", include: ["images"] }],
      });
      return res.json(cartDetails);
    } catch (error) {
      next(error);
    }
  }

  // [POST] /cart?replace
  async addToCart(req, res, next) {
    const user = req.session.user || req.user;
    if (!user) return res.json({ success: false });
    const quantity = parseInt(req.body?.quantity);
    try {
      if (req.query.hasOwnProperty("replace")) {
        if (quantity === 0) await CartDetail.destroy({ where: { id: req.body.id } });
        else await CartDetail.update({ quantity: quantity }, { where: { id: req.body.id } });
      } else {
        const item = await CartDetail.findOne({ where: { userId: user.id, bookId: req.body.bookId } });
        if (item) {
          item.quantity += quantity || 1;
          await item.save();
        } else {
          await CartDetail.create({ userId: user.id, bookId: req.body.bookId, quantity });
        }
      }

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /cart
  async deleteCartItem(req, res, next) {
    try {
      const item = await CartDetail.findByPk(req.query.id);
      await item.destroy();
      return res.json({ success: true, message: "Deleted" });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /cart/checkout
  async checkoutForm(req, res, next) {
    const user = req.session.user || req.user;
    try {
      const cartItems = await CartDetail.findAll({
        where: { userId: user.id },
        include: [
          {
            model: Book,
            as: "book",
            include: ["images"],
          },
        ],
      });
      if (cartItems.length === 0) return res.redirect("/cart");
      const addresses = await Address.findAll({ where: { userId: user.id } });
      return res.render("guest/cart/checkout", { cartItems, addresses });
    } catch (error) {
      next(error);
    }
  }

  async showPaymentForm(req, res, next) {
    const user = req.session.user || req.user;
    try {
      return res.render("guest/cart/payment");
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req, res, next) {
    var ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const user = req.session.user || req.user;
    const cartItems = await CartDetail.findAll({ where: { userId: user.id }, include: ["book"] });
    const amount = cartItems.reduce((total, item) => {
      return (total += item.quantity * item.book.price);
    }, 0);

    // Create new profile if not exist
    let profile;
    profile = await Address.findOne({ where: { address: req.body.address, phone: req.body.phone } });
    if (!profile) {
      profile = await Address.create({
        address: req.body.address,
        phone: req.body.phone,
        userId: user.id,
        name: "New profile",
      });
    }

    var tmnCode = vnPayParams["vnp_TmnCode"];
    var secretKey = vnPayParams["vnp_HashSecret"];
    var vnpUrl = vnPayParams["vnp_Url"];
    var returnUrl = vnPayParams["vnp_ReturnUrl"];

    var date = new Date();

    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = dateFormat(date, "HHmmss");
    // var amount = req.body.amount;
    var bankCode = "";

    var orderInfo = "Online payment";
    var orderType = "billpayment";
    var locale = "vn";
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    const newOrder = await Order.create({
      total: amount,
      userId: user.id,
      addressId: profile.id,
      paymentMethod: "VNPAY",
      transactionId: orderId,
    });

    const cartDetails = await CartDetail.findAll({ where: { userId: user.id }, include: ["book"] });
    for (const item of cartDetails) {
      await OrderDetail.create({
        price: item.book.price,
        quantity: item.quantity,
        orderId: newOrder.id,
        bookId: item.book.id,
      });
    }

    // console.log(vnpUrl)
    res.redirect(vnpUrl);
  }

  async paymentReturn(req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    // var config = require('config');
    // var tmnCode = config.get('vnp_TmnCode');
    var secretKey = vnPayParams.vnp_HashSecret;

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      const order = await Order.findOne({ where: { transactionId: orderId } });
      if (!order) return res.json({ success: false, message: "Order not exist" });
      if (rspCode !== "00")
        // return res.json({ success: false, message: 'Transaction failed' })
        return res.redirect("/payment/failed");
      order.transactionId = req.query.vnp_TransactionNo;
      order.paymentStatus = "paid";
      order.transdate = req.query.vnp_PayDate;
      await order.save();
      // let resData = await Order.create({
      //     total: vnp_Params.vnp_Amount,
      //     paymentStatus: vnp_Params.vnp_TransactionStatus,
      //     transactionId: vnp_Params.vnp_TransactionNo,
      //     paymentMethod: vnp_Params.vnp_CardType,
      //     transdate: vnp_Params.vnp_PayDate,

      // });

      // if (resData) {
      // }
      const usermail = await User.findOne({ where: { id: order.userId } });
      const orderdetailmail = await OrderDetail.findAll({ where: { orderId: order.id }, include: ["book"] });
      let strmail = `<div>
        <h3 style="margin-left: 35%; color: #00aff0">Order Information</h2>
        <div style="margin-left: 10%; color: red;">
            <p>Code orders: ${order.transactionId}</p>
            <p>Order date: ${order.createdAt.getDate() + "/" + order.createdAt.getMonth() + "/" + order.createdAt.getFullYear()}</p>
            
        </div>
        <h4 style="margin-left: 35%;">Order details</div>
        <table style="text-align: center; margin-left: auto; margin-right: auto">
            <tr>
                <th style="width: 20%;">Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>`;
      orderdetailmail.forEach(
        (element) =>
        (strmail = strmail.concat(
          `<tr>  
                <td>${element.book.name}</td> 
                <td>${element.quantity}</td> 
                <td>${element.price * element.quantity}</td> 
            </tr>`
        ))
      );
      strmail = strmail.concat(
        `</table>
          <div style="margin-left: 35%; margin-top: 20px; color: #00aff0">The total amount: ${order.total}</div>
        </div>`
      );
      mailer(usermail.email, "Information Order", strmail);

      res.render("guest/cart/payment_infor", { errCode: 0, data: vnp_Params });
    } else {
      res.render("guest/cart/payment_infor", { errCode: -1 });
    }
  }
}

export default new CartController