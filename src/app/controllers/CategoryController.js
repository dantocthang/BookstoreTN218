
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';

import Category from '../models/category.js';
import Book from '../models/book.js';
import { PER_PAGE } from '../../config/pagination.js';

class CategoryController {

    // [GET] /admin/categories
    async index(req, res, next) {
        try {
            const currentPage = parseInt(req.query.page || 1);

            const categories = await Category.findAndCountAll({
                attributes: ['id', 'name'],
                offset: (currentPage - 1) * PER_PAGE,
                limit: PER_PAGE,
            });

            const numberOfRecords = categories.count;
            const numberOfPages = Math.ceil(numberOfRecords / PER_PAGE);
            if (currentPage > numberOfPages && numberOfPages > 0) {
                return res.redirect('/admin/categories');
            }

            const startIndex = (currentPage - 1) * PER_PAGE + 1;
            let endIndex = startIndex + PER_PAGE - 1;
            if (endIndex > numberOfRecords) {
                endIndex = numberOfRecords;
            }
    
            res.render('admin/category', {
                layout: 'admin/layouts/main',
                categories: categories.rows,
                message: req.flash(),
                numberOfPages,
                startIndex,
                endIndex,
                numberOfRecords,
                currentPage,
                PER_PAGE,
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