let vnPayParams = {
    vnp_TmnCode: "21B72BKW", //Mã website tại VNPAY 
    vnp_HashSecret: "CDGANRJGEBVNHGDTINIMROEJSJTIRAPD", //Chuỗi bí mật
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: "http://localhost:3003/cart/payment_return",
}

export default vnPayParams