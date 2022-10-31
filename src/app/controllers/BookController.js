import { validationResult } from "express-validator";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);

import Book from "../models/book.js";
import Category from "../models/category.js";
import Author from "../models/author.js";
import Image from "../models/image.js";
import Publisher from "../models/publisher.js";
import Review from "../models/review.js";

class BookController {
  async getBooksList(req, res, next) {
    let limit = req.query.limit || 2;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let { count, rows: bookList } = await Book.findAndCountAll({
      include: ["author"],
      offset: offset,
      limit: limit,
    });

    return res.render("guest/list", { bookList: bookList, count: count });
  }

  /* [GET] /book/:bookId */
  async getBookDetail(req, res, next) {
    const { bookId } = req.params;
    const book = await Book.findOne({
      include: ["author", "category", "publisher", "images", {
        model: Review, as: 'reviews', include: ['user']
      }],
      where: { id: bookId },
    });

    let bookList = await Book.findAll({
      include: ["author", "category", "publisher", 'reviews'],
    });

    // console.log("chi tiet sach:", bookList);
    return res.render("guest/book/detail", { book: book, bookList: bookList, errors: [] });
    return res.json(bookList);
  }

  // [GET] /admin/book
  async adminBooks(req, res, next) {
    const books = await Book.findAll({
      include: ["author", "category", "images"],
    });
    const images = await Image.findOne();
    return res.render("admin/book", {
      layout: "admin/layouts/main",
      books,
      images,
    });
  }

  // [GET /admin/book/create
  async createBookForm(req, res, next) {
    const categories = await Category.findAll();
    const authors = await Author.findAll();
    const publishers = await Publisher.findAll();
    return res.render("admin/book/form", {
      layout: "admin/layouts/main",
      errors: [],
      values: {},
      categories,
      authors,
      publishers
    });
  }

  // [POST] /admin/book/create
  async createBook(req, res, next) {
    const categories = await Category.findAll();
    const authors = await Author.findAll();
    const publishers = await Publisher.findAll();
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render("admin/book/form", {
        layout: "admin/layouts/main",
        errors: errors.array(),
        categories,
        authors,
        publishers,
        values: req.body,
      });
    try {
      const book = await Book.create(req.body);

      for (const image of req.files) {
        const tail = image.originalname.split(".")[1];
        const fileName = image.filename;
        await Image.create({ path: `files/${fileName}`, bookId: book.id });
      }
      return res.redirect("/admin/book");
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
      console.log(book.toJSON())
      if (!book) return res.status(404).render("404", { layout: "404" });
      const categories = await Category.findAll();
      const authors = await Author.findAll();
      const publishers = await Publisher.findAll();
      return res.render("admin/book/form", {
        layout: "admin/layouts/main",
        errors: [],
        values: book,
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
    console.log(req.body);
    const categories = await Category.findAll();
    const authors = await Author.findAll();
    const publishers = await Publisher.findAll();
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.render("admin/book/form", {
        layout: "admin/layouts/main",
        errors: errors.array(),
        categories,
        authors,
        publishers,
        values: req.body,
      });
    try {
      await Book.update(req.body, { where: { id: req.params.bookId } });
      for (const image of req.files) {
        // const tail = image.originalname.split('.')[1]
        const fileName = image.filename;
        await Image.create({
          path: `files/${fileName}`,
          bookId: req.params.bookId,
        });
      }
      return res.redirect("/admin/book");
    } catch (error) {
      next(error);
    }
  }

  // [DELETE] /admin/book/:bookId
  async deleteBook(req, res, next) {
    try {
      await Book.destroy({ where: { id: req.params.bookId } });
      return res.redirect("/admin/book");
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
