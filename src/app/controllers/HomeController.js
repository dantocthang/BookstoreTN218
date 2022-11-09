import Category from '../models/category.js'
import Book from '../models/book.js'

class HomeController {
    async index(req, res, next) {
        const books = await Book.findAll({ include: ['images', 'category'] });
        return res.render('guest/home', { layout: 'guest/layouts/main', books })
    }

    async getCategories(req, res, next) {
        try {
            const categories = await Category.findAll()
            return res.json({ success: true, categories })
        } catch (error) {
            next(error)
        }
    }
}

export default new HomeController()