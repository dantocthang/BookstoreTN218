import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

import Publisher from '../models/publisher.js';
import Book from '../models/book.js';

class PublisherController {

    // [GET] /admin/publishers
    async index(req, res, next) {
        try {
            
            const publishers = res.paginatedResult.model;
            const numberOfPages = res.paginatedResult.numberOfPages;
            const startIndex = res.paginatedResult.startIndex;
            const endIndex = res.paginatedResult.endIndex;
            const numberOfRecords = res.paginatedResult.numberOfRecords;
            const currentPage = res.paginatedResult.currentPage;

            res.render('admin/publisher', {
                layout: 'admin/layouts/main',
                message: req.flash(),
                publishers,
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

    // [GET] /admin/publishers/create
    createGet(req, res, next) {
        res.render('admin/publisher/create', {
            layout: 'admin/layouts/main',
            data: [],
            errors: [],
        });
    }
    // [POST] /admin/publishers/create
    async createPost(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.render("admin/publisher/create", {
                layout: 'admin/layouts/main',
                data: req.body,
                errors: errors.array(),
            });

        try {
            const publisher = await Publisher.create({
                name: req.body.name,
            });

            req.flash('success', 'Đăng ký thành công!');
            res.redirect('/admin/publishers');
            
        } catch(error) {
            next(error);
        }
    }

    // [GET] /admin/publishers/:id/edit
    async editGet(req, res, next) {
        try {
            const publisher = await Publisher.findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

            res.render('admin/publisher/edit', {
                layout: 'admin/layouts/main',
                publisher: publisher.dataValues,
                errors: [],
            });

        } catch(error) {
            next(error);
        }
    }
    // [PUT] /admin/publishers/:id/edit
    async editPut(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.render("admin/publisher/edit", {
                layout: 'admin/layouts/main',
                publisher: req.body,
                errors: errors.array(),
            });

        try {
            const publisher = await Publisher.update(
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
            res.redirect('/admin/publishers');
            
        } catch(error) {
            next(error);
        }
    }

    // [DELETE] /admin/publishers/:id/delete
    async delete(req, res, next) {
        var book;
        try {
            book = await Book.findOne({
                where: {
                    publisherId: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

        } catch(error) {
            next(error);
        }

        if (!book) {
            try {
                const publisher = await Publisher.destroy({
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
            req.flash('error', 'Không thể xóa! Đã có sách thuộc nhà xuất bản này!');
        }

        res.redirect('/admin/publishers');
    }
}

export default new PublisherController();