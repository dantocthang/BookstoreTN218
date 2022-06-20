import express from 'express'
import session from 'express-session' // Session, cookie chính cho dự án
import { fileURLToPath } from 'url' // Sử dụng để upload vào thư mục
import cors from 'cors' // Cho phép cấp api cho các tên miền khác (khác port cũng vậy)

// Log request ở terminal
// import morgan from 'morgan' 

import methodOverride from 'method-override' // Ghi đè phương thức POST của Form với PUT, PATCH, DELETE
import cookieParser from 'cookie-parser'
import path from 'path'
import { dirname } from 'path';
import flash from 'connect-flash' // Flash message, hoạt động với toastr ở giao diện
import expressLayouts from 'express-ejs-layouts' // Thêm layout cho ejs, gán layout mặc định, có thể tùy biến cho mỗi view
import passport from 'passport' // Xác thực người dùng, chiến thuật login với Google, Facebook
import dotenv from 'dotenv'


import route from './routes/index.js'
import db from './config/db/index.js'
import initializePassport from './config/passport.js'
import { fetchUserInfo } from './util/checkAuthenticated.js'
import { cartSession } from './util/cartSession.js'
import helpers from './util/helpers.js'

const app = express()
const port = process.env.PORT || 3003

// Cấu hình để express nhận .env
dotenv.config()

// View engines
app.use(expressLayouts)
app.set('layout', '../../resourses/views/layouts/main.ejs')
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: false }))



// Khởi tạo passport
initializePassport(passport)

// Sử dụng cors để gọi api từ dự án khác
app.use(cors())

// Cấu hình session-cookie-flash
app.use(cookieParser('keyboard cat'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 ngày
}));
app.use(flash());

// Passport validate data
app.use(passport.initialize())
app.use(passport.session());

// Kết nối mongoDB
db()

// Cấu hình morgan
// app.use(morgan('combined'))
app.use(methodOverride('_method'))

// Cấu hình thư mục để upload file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.set('views', path.join(__dirname, 'resourses/views'));
app.use(express.static(path.join(__dirname, 'public')))


// Custom helpers
helpers(app);


// Global middlewares
app.use(fetchUserInfo) // Lấy tên và hình ảnh của user pass cho layout
app.use(cartSession) // Quản lý giỏ hàng

// Định tuyến
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})