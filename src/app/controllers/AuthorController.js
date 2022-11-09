
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

import Author from '../models/author.js';
import Book from '../models/book.js';

class AuthorController {

    // [GET] /admin/authors
    async index(req, res, next) {
        try {
            const authors = res.paginatedResult.model;
            const numberOfPages = res.paginatedResult.numberOfPages;
            const startIndex = res.paginatedResult.startIndex;
            const endIndex = res.paginatedResult.endIndex;
            const numberOfRecords = res.paginatedResult.numberOfRecords;
            const currentPage = res.paginatedResult.currentPage;

            res.render('admin/author', {
                layout: 'admin/layouts/main',
                message: req.flash(),
                authors,
                numberOfPages,
                startIndex,
                endIndex,
                numberOfRecords,
                currentPage,
            });

        } catch(error) {
            next(error);
        }
    }

    // [GET] /admin/authors/create
    createGet(req, res, next) {
        res.render('admin/author/create', {
            layout: 'admin/layouts/main',
            data: [],
            errors: [],
        });
    }
    // [POST] /admin/authors/create
    async createPost(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.render("admin/author/create", {
                layout: 'admin/layouts/main',
                data: req.body,
                errors: errors.array(),
            });

        try {
            const author = await Author.create({
                name: req.body.name,
                description: req.body.description,
            });

            req.flash('success', 'Thêm thành công!');
            res.redirect('/admin/authors');
            
        } catch(error) {
            next(error);
        }
    }

    // [GET] /admin/authors/:id/edit
    async editGet(req, res, next) {
        try {
            const author = await Author.findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

            res.render('admin/author/edit', {
                layout: 'admin/layouts/main',
                author: author.dataValues,
                errors: [],
            });

        } catch(error) {
            next(error);
        }
    }
    // [PUT] /admin/authors/:id/edit
    async editPut(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.render("admin/author/edit", {
                layout: 'admin/layouts/main',
                author: req.body,
                errors: errors.array(),
            });

        try {
            const author = await Author.update(
                { ...req.body },
                {
                    where: {
                        id: {
                            [Op.eq]: req.params.id,
                        },
                    },
                }
            );

            req.flash('success', 'Chỉnh sửa thành công!');
            res.redirect('/admin/authors');
            
        } catch(error) {
            next(error);
        }
    }

    // [DELETE] /admin/authors/:id/delete
    async delete(req, res, next) {
        var book;
        try {
            book = await Book.findOne({
                where: {
                    authorId: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

        } catch(error) {
            next(error);
        }

        if (!book) {
            try {
                const author = await Author.destroy({
                    where: {
                        id: {
                            [Op.eq]: req.params.id,
                        },
                    },
                });

                req.flash('success', 'Xóa thành công!');
            } catch(error) {
                next(error);
            }
        } else {
            req.flash('error', 'Không thể xóa! Đã có sách thuộc tác giả này!');
        }

        res.redirect('/admin/authors');
    }

}

export default new AuthorController();