import { check, body } from 'express-validator'
import User from '../app/models/user.js'

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

export const bookValidator = [
    body('name').isLength({ min: 5, max: 100 }).withMessage('Book name length must be between 5 - 100 characters'),
    body('authorId').customSanitizer(value => {
        return parseInt(value);
    }).isInt({ min: 1 }).withMessage('Invalid author'),
    body('categoryId').customSanitizer(value => {
        return parseInt(value);
    }).isInt({ min: 1 }).withMessage('Invalid category'),
    body('publisherId').customSanitizer(value => {
        return parseInt(value);
    }).isInt({ min: 1 }).withMessage('Invalid publisher'),
    body('price').isInt({ min: 1 }).withMessage('Price must greater than 0'),
    body('stock').isInt({ min: 1 }).withMessage('Invalid stock value'),
    body('description').not().isEmpty().withMessage('Please provide book description'),
    body('year').isInt({ min: 1000, max: new Date().getFullYear }).withMessage('Invalid year'),
    // body('images').notEmpty().withMessage('Upload at least one image'),
]

export const authorValidator = [
    body('name').isLength({ min: 1, max: 100 }).withMessage('Author name length must be between 1 - 100 characters'),
]

export const categoryValidator = [
    body('name').isLength({ min: 1, max: 100 }).withMessage('Category name length must be between 1 - 100 characters'),
]

export const publisherValidator = [
    body('name').isLength({ min: 1, max: 100 }).withMessage('Publisher name length must be between 1 - 100 characters'),
]

export const reviewValidator = [
    body('content').isLength({ min: 1, max: 100 }).withMessage('Review content must not be between 1 - 100 characters'),
    body('stars').isInt({ min: 1, max: 5 }).withMessage('Invalid rating'),
]