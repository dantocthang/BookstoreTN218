import Book from '../models/book.js';

class BookController {    
    async getBooksList(req, res, next) {
            let limit = req.query.limit || 2;
            let page = req.query.page || 1;
            let offset = (page - 1) * limit;
            let {count, rows: bookList} =  await Book.findAndCountAll({
                include: ['author'],
                offset: offset,
                limit: limit,
            });
            
            return res.render('guest/list', {bookList: bookList, count: count});
    }
}

const a = new BookController()

export default a