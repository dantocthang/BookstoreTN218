import book from '../models/book.js';

class BookController {    
    async getBooksList(req, res, next) {
            let limit = 2;
            let page = req.query.page;
            let offset = (page - 1) * limit;
            if(!page){
                offset = 0;
            }
            let count = await book.count();
            let bookList =  await book.findAll({
                offset: offset,
                limit: limit,
            });
            
            return res.render('bookList.ejs', {bookList: bookList, count: count});
    }
}

const a = new BookController()

export default a