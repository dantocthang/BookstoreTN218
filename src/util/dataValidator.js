import { check, body } from 'express-validator'

export const courseValidator = [
    body('name').matches(/^[A-Za-z0-9 ]+$/).withMessage('Tên khóa học không chứa ký tự đặc biệt và dài 1 - 100 ký tự'),
    body('description').escape()
]

export const userValidator = [
    body('username').matches(/^[a-zA-Z0-9_]{6,20}$/).withMessage('Tên đăng nhập phải dài 6-20 ký tự gồm ký tự hoa thường, ký số và dấu gạch chân'),
    body('email').isEmail().withMessage('Email không hợp lệ').normalizeEmail(),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            console.log(value, req.body.password)
            throw new Error('Password confirmation is incorrect');
        }
        else {
            return true;
        }   
    }).withMessage('Mật khẩu xác nhận không khớp')

]
