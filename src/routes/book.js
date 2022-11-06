import express from 'express';

import BookController from '../app/controllers/BookController.js'
import { reviewValidator } from '../util/dataValidator.js'

const router = express.Router();

router.get('/get_search_data', BookController.searchBook)
router.get('/', BookController.getBooksList);
router.get('/:bookId', BookController.getBookDetail);
router.post('/:bookId/review', ...reviewValidator, BookController.review);


export default router;