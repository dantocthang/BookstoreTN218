
import { Op } from 'sequelize';

import Author from '../models/author.js';
import Book from '../models/book.js';

class AuthorController {

    // [GET] /admin/authors
    async index(req, res, next) {
        // Find all users
        const authors = await Author.findAll({
            attributes: ['id', 'name', 'description']
        });
        
        res.render('admin/author', {
            layout: 'admin/layouts/main',
            authors
        });
    }

    // [GET] /admin/authors/create
    createGet(req, res, next) {
        res.render('admin/author/create', {
            layout: 'admin/layouts/main',
        });
    }
    // [POST] /admin/authors/create
    async createPost(req, res, next) {
        try {
            const author = await Author.create({
                name: req.body.name,
                description: req.body.description,
            });

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
            });

        } catch(error) {
            next(error);
        }
    }

    // [PUT] /admin/authors/:id/edit
    async editPut(req, res, next) {
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
            } catch(error) {
                next(error);
            }
        } else {
            console.log('da co sach');
        }

        res.redirect('/admin/authors');
    }

}

export default new AuthorController();