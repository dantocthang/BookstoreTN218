import express from 'express';

import BookController from '../app/controllers/BookController.js'

const router = express.Router();

router.get('/', BookController.getBooksList);

export default router;

