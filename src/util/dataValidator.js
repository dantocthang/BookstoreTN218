import { check } from 'express-validator'

const validator = {
    createCourse: check('description').matches(/\d/).withMessage('must contain a number'),
    
}

export default validator