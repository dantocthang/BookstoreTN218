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
                publishers
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
            } catch(error) {
                next(error);
            }
        } else {
            console.log('da co sach');
        }

        res.redirect('/admin/publishers');
    }
}

export default new PublisherController();