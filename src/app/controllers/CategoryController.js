
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

import Category from '../models/category.js';
import Book from '../models/book.js';

class CategoryController {

    // [GET] /admin/categories
    async index(req, res, next) {
        try {
            
            const categories = res.paginatedResult.model;
            const numberOfPages = res.paginatedResult.numberOfPages;
            const startIndex = res.paginatedResult.startIndex;
            const endIndex = res.paginatedResult.endIndex;
            const numberOfRecords = res.paginatedResult.numberOfRecords;
            const currentPage = res.paginatedResult.currentPage;
    
            res.render('admin/category', {
                layout: 'admin/layouts/main',
                message: req.flash(),
                categories,
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

    // [GET] /admin/categories/create
    createGet(req, res, next) {
        res.render('admin/category/create', {
            layout: 'admin/layouts/main',
            data: [],
            errors: [],
        });
    }
    // [POST] /admin/categories/create
    async createPost(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.render("admin/category/create", {
                layout: 'admin/layouts/main',
                data: req.body,
                errors: errors.array(),
            });

        try {
            const category = await Category.create({
                name: req.body.name,
            });

            req.flash('success', 'Đăng ký thành công!');
            res.redirect('/admin/categories');
            
        } catch(error) {
            next(error);
        }
    }

    // [GET] /admin/categories/:id/edit
    async editGet(req, res, next) {
        try {
            const category = await Category.findOne({
                where: {
                    id: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

            res.render('admin/category/edit', {
                layout: 'admin/layouts/main',
                category: category.dataValues,
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
            return res.render("admin/category/edit", {
                layout: 'admin/layouts/main',
                category: req.body,
                errors: errors.array(),
            });

        try {
            const category = await Category.update(
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
            res.redirect('/admin/categories');
            
        } catch(error) {
            next(error);
        }
    }

    // [DELETE] /admin/categories/:id/delete
    async delete(req, res, next) {
        var book;
        try {
            book = await Book.findOne({
                where: {
                    categoryId: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

        } catch(error) {
            next(error);
        }

        if (!book) {
            try {
                const category = await Category.destroy({
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
            req.flash('error', 'Không thể xóa! Đã có sách thuộc danh mục này!');
        }

        res.redirect('/admin/categories');
    }
}

export default new CategoryController();