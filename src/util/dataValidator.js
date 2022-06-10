import { body } from 'express-validator'

export const courseValidator = [
    body('name').matches(/^[A-Za-z0-9 ]+$/).withMessage('Tên khóa học không chứa ký tự đặc biệt và dài 1 - 100 ký tự'),
    body('description').escape()    
]
