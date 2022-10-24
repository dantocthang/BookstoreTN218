import { Op } from 'sequelize';

import Publisher from '../models/publisher.js';
import Book from '../models/book.js';

class PublisherController {

    // [GET] /admin/publishers
    async index(req, res, next) {
        try {
            const publishers = await Publisher.findAll({
                attributes: ['id', 'name']
            });
    
            res.render('admin/publisher', {
                layout: 'admin/layouts/main',
                publishers,
                message: req.flash(),
            });
        } catch(error) {
            next(error);
        }
    }

    // [GET] /admin/publishers/create
    createGet(req, res, next) {
        res.render('admin/publisher/create', {
            layout: 'admin/layouts/main',
        });
    }
    // [POST] /admin/publishers/create
    async createPost(req, res, next) {
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
            });

        } catch(error) {
            next(error);
        }
    }
    // [PUT] /admin/publishers/:id/edit
    async editPut(req, res, next) {
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