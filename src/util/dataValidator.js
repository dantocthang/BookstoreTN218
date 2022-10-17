import { check, body } from 'express-validator'
import User from '../app/models/user.js'

export const courseValidator = [
    body('name').matches(/^[a-z0-9A-Z ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]{1,100}$/).withMessage('Tên khóa học không chứa ký tự đặc biệt và dài 1 - 100 ký tự'),
    body('description').escape()
]

export const userValidator = [
    body('email').isEmail().withMessage('Email không hợp lệ').custom(async (value) => {
        const user = await User.findOne({ where: { email: value } })
        if (user) throw new Error('This email has already been usedf')
        return true
    }),
    body('fullName').not().isEmpty().withMessage('Full name must not be empty'),
    body('password').notEmpty().withMessage('Password must not be empty').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/).withMessage('Password must contains at least 1 Uppercase letter, 1 lowercase letter and 1 number'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation is incorrect');
        }
        return true
    }).withMessage('Mật khẩu xác nhận không khớp')
]
