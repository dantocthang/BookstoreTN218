
import { Op } from 'sequelize';

import Category from '../models/category.js';

class CategoryController {

    // [GET] /admin/categories
    async index(req, res, next) {
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name']
            });
    
            res.render('admin/category', {
                layout: 'admin/layouts/main',
                categories
            });
        } catch(error) {
            next(error);
        }
    }

    // [GET] /admin/categories/create
    createGet(req, res, next) {
        res.render('admin/category/create', {
            layout: 'admin/layouts/main',
        });
    }
    // [POST] /admin/categories/create
    async createPost(req, res, next) {
        try {
            const category = await Category.create({
                name: req.body.name,
            });

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
            });

        } catch(error) {
            next(error);
        }
    }
    // [PUT] /admin/authors/:id/edit
    async editPut(req, res, next) {
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

            res.redirect('/admin/categories');
            
        } catch(error) {
            next(error);
        }
    }

    // [DELETE] /admin/categories/:id/delete
    async delete(req, res, next) {
        try {
            const category = await Category.destroy({
                where: {
                    id: {
                        [Op.eq]: req.params.id,
                    },
                },
            });

            res.redirect('/admin/categories');
            
        } catch(error) {
            next(error);
        }
    }
}

export default new CategoryController();