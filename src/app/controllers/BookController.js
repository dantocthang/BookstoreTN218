import { validationResult } from 'express-validator';
import Book from '../models/book.js';
import Category from '../models/category.js';
import Author from '../models/author.js';

class BookController {
    async getBooksList(req, res, next) {
        let limit = req.query.limit || 2;
        let page = req.query.page || 1;
        let offset = (page - 1) * limit;
        let { count, rows: bookList } = await Book.findAndCountAll({
            include: ['author'],
            offset: offset,
            limit: limit,
        });

        return res.render('guest/list', { bookList: bookList, count: count });
    }

    // [GET] /admin/book
    async adminBooks(req, res, next) {
        const books = await Book.findAll({ include: ['author', 'category', 'images'] })
        return res.render('admin/book', { layout: 'admin/layouts/main', books });
    }

    // [GET /admin/book/create
    async createBookForm(req, res, next) {
        const categories = await Category.findAll()
        const authors = await Author.findAll()
        return res.render('admin/book/form', { layout: 'admin/layouts/main', errors: [], values: {}, categories, authors });
    }

    // [POST] /admin/book/create
    async createBook(req, res, next) {
        const categories = await Category.findAll()
        const authors = await Author.findAll()
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.render('admin/book/form', { layout: 'admin/layouts/main', errors: errors.array(), categories, authors, values: req.body });
        try {
            await Book.create(req.body)
            return res.redirect('/admin/book')
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /admin/book/:bookId
    async updateBookForm(req, res, next) {
        try {
            const book = await Book.findByPk(req.params.bookId)
            if (!book) return res.status(404).render('404', { layout: '404' })
            const categories = await Category.findAll()
            const authors = await Author.findAll()
            return res.render('admin/book/form', { layout: 'admin/layouts/main', errors: [], values: book, categories, authors });
        } catch (error) {
            next(error)
        }
    }

    // [PUT] /admin/book/:bookId 
    async updateBook(req, res, next) {
        const categories = await Category.findAll()
        const authors = await Author.findAll()
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.render('admin/book/form', { layout: 'admin/layouts/main', errors: errors.array(), categories, authors, values: req.body });
        try {
            await Book.update(req.body, { where: { id: req.params.bookId } })
            return res.redirect('/admin/book')
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /admin/book/:bookId
    async deleteBook(req, res, next) {
        try {
            await Book.destroy({ where: { id: req.params.bookId } })
            return res.redirect('/admin/book')
        } catch (error) {
            next(error)
        }
    }
}

const a = new BookController()

export default a