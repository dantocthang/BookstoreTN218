import { validationResult } from "express-validator";
import sequelize, { Op } from "sequelize";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);

import Book from "../models/book.js";
import OrderDetail from "../models/order-detail.js";
import Order from "../models/order.js";
import Category from "../models/category.js";
import Author from "../models/author.js";
import Image from "../models/image.js";
import Publisher from "../models/publisher.js";
import Review from "../models/review.js";

import { PER_PAGE } from '../../config/pagination.js';

class BookController {
  async getBooksList(req, res, next) {
    let limit = PER_PAGE;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let filter = req.query.filter;

    const categories = await Category.findAll()
    const authors = await Author.findAll()
    const publishers = await Publisher.findAll()

    let queryParams = {}
    if (req.query.categoryId) queryParams.categoryId = req.query.categoryId
    if (req.query.authorId) queryParams.authorId = req.query.authorId
    if (req.query.publisherId) queryParams.publisherId = req.query.publisherId

    if (filter == 'newest' || filter == 'oldest') {
      if (filter == 'newest') {
        var { count, rows: bookList } = await Book.findAndCountAll({
          where: { ...queryParams },
          include: ['author', 'category', 'images'],
          offset: offset,
          limit: limit,
          order: [['updatedAt', 'DESC']]
        });
      } else {
        var { count, rows: bookList } = await Book.findAndCountAll({
          where: { ...queryParams },
          include: ['author', 'category', 'images'],
          offset: offset,
          limit: limit,
          order: [['updatedAt', 'ASC']]
        });
      }
    } else {
      var { count, rows: bookList } = await Book.findAndCountAll({
        where: { ...queryParams },
        include: ['author', 'category', 'images'],
        offset: offset,
        limit: limit,
      });
    }
    let pageCount = Math.ceil(count / limit);

    return res.render("guest/list", { 
        bookList: bookList, 
        count: count, 
        limit: limit, 
        pageCount: pageCount, 
        filter: filter, 
        categories, 
        authors, 
        publishers, 
        query: req.query ,
        currentPage: page,
    });
  }

  /* [GET] /book/:bookId */
  async getBookDetail(req, res, next) {
    const { bookId } = req.params;
    let ableToReview = false
    const user = req.session.user || req.user || null
    if (user) {
      const isBought = await OrderDetail.findOne({
        where: { bookId: bookId },
        include: [{ model: Order, as: 'order', where: { userId: user.id } }]
      })
      if (isBought) ableToReview = true;
    }
    const book = await Book.findOne({
      include: ["author", "category", "publisher", "images", {
        model: Review, as: 'reviews', include: ['user']
      }],
      where: { id: bookId },
    });

    let bookList = await Book.findAll({
      where: { authorId: book.authorId, id: { [Op.ne]: book.id } },
      include: ["author", "category", "publisher", 'reviews', "images"],
      limit: 3
    });

    return res.render("guest/book/detail", { book: book, bookList: bookList, errors: [], ableToReview });
    // return res.json(bookList);
  }

  // [GET] /admin/book
  async adminBooks(req, res, next) {

    const books = res.paginatedResult.model;
    const numberOfPages = res.paginatedResult.numberOfPages;
    const startIndex = res.paginatedResult.startIndex;
    const endIndex = res.paginatedResult.endIndex;
    const numberOfRecords = res.paginatedResult.numberOfRecords;
    const currentPage = res.paginatedResult.currentPage;

    return res.render("admin/book", {
      layout: "admin/layouts/main",
      images: books[0].images[0],
      message: req.flash(),
      books,
      numberOfPages,
      startIndex,
      endIndex,
      numberOfRecords,
      currentPage,
    });
  }

  // [GET] /admin/book/create
  async createBookForm(req, res, next) {
    const categories = await Category.findAll();
    const authors = await Author.findAll();
    const publishers = await Publisher.findAll();
    return res.render("admin/book/form", {
      layout: "admin/layouts/main",
      errors: [],
      values: {},
      update: false,
      categories,
      authors,
      publishers,
    });
  }

  // [POST] /admin/book/create
  async createBook(req, res, next) {
    const categories = await Category.findAll();
    const authors = await Author.findAll();
    const publishers = await Publisher.findAll();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      for (const image of req.files)
        await unlinkAsync(image.path);
      return res.render("admin/book/form", {
        layout: "admin/layouts/main",
        errors: errors.array(),
        update: false,
        categories,
        authors,
        publishers,
        values: req.body,
      });
    }
    try {
      const book = await Book.create(req.body);

      for (const image of req.files) {
        const tail = image.originalname.split(".")[1];
        const fileName = image.filename;
        await Image.create({ path: `files/${fileName}`, bookId: book.id });
      }

      // toast
      req.flash('success', 'Thêm thành công!');
      res.redirect('/admin/book');
    } catch (error) {
      next(error);
    }
  }

  // [GET] /admin/book/:bookId
  async updateBookForm(req, res, next) {
    try {
      const book = await Book.findByPk(req.params.bookId, {
        include: ["images", "publisher"],
      });
      if (!book) return res.status(404).render("404", { layout: "404" });
      const categories = await Category.findAll();
      const authors = await Author.findAll();
      const publishers = await Publisher.findAll();
      return res.render("admin/book/form", {
        layout: "admin/layouts/main",
        errors: [],
        values: book,
        update: true,
        categories,
        authors,
        publishers,
      });
    } catch (error) {
      next(error);
    }
  }

  // [PUT] /admin/book/:bookId
  async updateBook(req, res, next) {
    const categories = await Category.findAll();
    const authors = await Author.findAll();
    const publishers = await Publisher.findAll();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      for (const image of req.files)
        await unlinkAsync(image.path);
      return res.render("admin/book/form", {
        layout: "admin/layouts/main",
        errors: errors.array(),
        categories,
        authors,
        update: true,
        publishers,
        values: { ...req.body, id: req.params.bookId },
      });
    }
    try {
      await Book.update(req.body, { where: { id: req.params.bookId } });
      for (const image of req.files) {
        const fileName = image.filename;
        await Image.create({
          path: `files/${fileName}`,
          bookId: req.params.bookId,
        });
      }

      // toast
      req.flash('success', 'Chỉnh sửa thành công!');
      res.redirect('/admin/book');
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /admin/book/:bookId
  async deleteBook(req, res, next) {
    try {
      await Book.destroy({ where: { id: req.params.bookId } });

      //toast
      req.flash('success', 'Xóa thành công!');
      res.redirect('/admin/book');
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /admin/book/:bookId/image/:imageId
  async deleteImage(req, res, next) {
    try {
      const image = await Image.findByPk(req.params.imageId);
      await Image.destroy({ where: { id: req.params.imageId } });
      await unlinkAsync(`src/public/${image.path}`);
      return res.json({ success: true, message: "Deleted" });
      // return res.redirect(`/admin/book/${req.params.bookId}`)
    } catch (error) {
      next(error);
    }
  }

  async searchBook(req, res, next) {
    let searchData = req.query.search_query;
    const Op = sequelize.Op;
    let books = await Book.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchData + '%' } },
          { description: { [Op.like]: '%' + searchData + '%' } },
        ],
      }
    })
    let categories = await Category.findAll({
      where: { name: { [Op.like]: '%' + searchData + '%' } }
    })
    let authors = await Author.findAll({
      where: { name: { [Op.like]: '%' + searchData + '%' } }
    })
    let publishers = await Publisher.findAll({ where: { name: { [Op.like]: '%' + searchData + '%' } } })
    let result = {
      books,
      categories,
      authors,
      publishers
    }
    res.json(result);
  }
  // [POST] /book/:bookId/review
  async review(req, res, next) {
    const user = req.session.user || req.user
    if (!user) return res.redirect('/auth/login')
    const errors = validationResult(req)
    const book = await Book.findOne({
      include: ["author", "category", "publisher", "images"],
      where: { id: req.params.bookId },
    });

    let bookList = await Book.findAll({
      include: ["author", "category", "publisher", 'reviews'],
    });
    if (!errors.isEmpty()) return res.render('guest/book/detail', { errors: errors.array(), book, bookList })
    try {
      const review = await Review.findOne({ where: { userId: user.id, bookId: req.params.bookId } })
      if (!review)
        await Review.create({ ...req.body, userId: user.id, bookId: req.params.bookId })
      else review.update(req.body)
      return res.redirect(`/book/${req.params.bookId}`)
    } catch (error) {
      next(error)
    }
  }

}

const a = new BookController();

export default a;
