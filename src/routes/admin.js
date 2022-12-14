import express from 'express';
import multer from 'multer'
const upload = multer({ dest: 'src/public/files' })


import adminController from '../app/controllers/AdminController.js';
import authorController from '../app/controllers/AuthorController.js';
import categoryController from '../app/controllers/CategoryController.js';
import publisherController from '../app/controllers/PublisherController.js';
import BookController from '../app/controllers/BookController.js';
import orderController from '../app/controllers/OrderController.js';

import paginate from '../app/middlewares/paginate.middleware.js';

import Author from '../app/models/author.js';
import Category from '../app/models/category.js';
import Publisher from '../app/models/publisher.js';
import Book from '../app/models/book.js';
import Order from '../app/models/order.js';

import {
    bookValidator,
    authorValidator,
    categoryValidator,
    publisherValidator,
    createBookImageValidator,
    updateBookImageValidator
} from '../util/dataValidator.js';

const router = express.Router();

router.get('/home', adminController.index);
router.get('[/]', adminController.index);

// author
router.get('/authors', paginate(Author), authorController.index);

router.get('/authors/create', authorController.createGet);
router.post('/authors/create', ...authorValidator, authorController.createPost);

router.get('/authors/:id/edit', authorController.editGet);
router.put('/authors/:id/edit', ...authorValidator, authorController.editPut);

router.delete('/authors/:id/delete', authorController.delete);

// category
router.get('/categories', paginate(Category), categoryController.index);

router.get('/categories/create', categoryController.createGet);
router.post('/categories/create', ...categoryValidator, categoryController.createPost);

router.get('/categories/:id/edit', categoryController.editGet);
router.put('/categories/:id/edit', ...categoryValidator, categoryController.editPut);

router.delete('/categories/:id/delete', categoryController.delete);

// publisher
router.get('/publishers', paginate(Publisher), publisherController.index);

router.get('/publishers/create', publisherController.createGet);
router.post('/publishers/create', ...publisherValidator, publisherController.createPost);

router.get('/publishers/:id/edit', publisherController.editGet);
router.put('/publishers/:id/edit', ...publisherValidator, publisherController.editPut);

router.delete('/publishers/:id/delete', publisherController.delete);

// Book
router.get('/book', paginate(Book), BookController.adminBooks)
router.get('/book/create', BookController.createBookForm)
router.post('/book/create', upload.array('images[]', 10), ...bookValidator, createBookImageValidator, BookController.createBook)
router.get('/book/:bookId', BookController.updateBookForm)
router.put('/book/:bookId', upload.array('images[]', 10), ...bookValidator, updateBookImageValidator, BookController.updateBook)
router.delete('/book/:bookId', BookController.deleteBook)
router.delete('/book/:bookId/image/:imageId', BookController.deleteImage)

// Order
router.get('/orders', paginate(Order), orderController.index);
router.get('/order/:orderId', orderController.view);

export default router;