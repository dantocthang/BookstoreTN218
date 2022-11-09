
import Order from '../models/order.js';
import OrderDetail from '../models/order-detail.js';
import { Op } from 'sequelize';
import User from '../models/user.js';
import Address from '../models/address.js';
import Book from '../models/book.js';
import Image from '../models/image.js';

import { PER_PAGE } from '../../config/pagination.js';

class OrderController {

    // [GET] /admin/orders
    async index(req, res, next) {
        try {
            
            const orders = res.paginatedResult.model;
            const numberOfPages = res.paginatedResult.numberOfPages;
            const startIndex = res.paginatedResult.startIndex;
            const endIndex = res.paginatedResult.endIndex;
            const numberOfRecords = res.paginatedResult.numberOfRecords;
            const currentPage = res.paginatedResult.currentPage;

            res.render('admin/order', {
                layout: 'admin/layouts/main',
                orders,
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

    // [GET] /admin/order/:orderId
    async view(req, res, next) {
        try {
            const currentPage = parseInt(req.query.page || 1);
            const orderId = req.params.orderId;

            const order = await Order.findByPk(orderId, {
                attributes: ['id', 'total', 'userId', 'addressId']
            });

            const user = await User.findByPk(order.userId);
            const address = await Address.findByPk(order.addressId);
            const orderDetails = await OrderDetail.findAndCountAll({
                where: {
                    orderId: {
                        [Op.eq]: orderId,
                    },
                },
                offset: (currentPage - 1) * PER_PAGE,
                limit: PER_PAGE,
            });

            for (const orderDetail of orderDetails.rows) {
                const book = await Book.findByPk(orderDetail.bookId);
                const image = await Image.findOne({
                    where: {
                        bookId: {
                            [Op.eq]: book.id,
                        },
                    },
                });

                orderDetail.bookName = book.name;
                orderDetail.bookImage = image.path;
            }

            const numberOfRecords = orderDetails.count;
            const numberOfPages = Math.ceil(numberOfRecords / PER_PAGE);
            if (currentPage > numberOfPages && numberOfPages > 0) {
                return res.redirect('/admin/orders');
            }

            const startIndex = (currentPage - 1) * PER_PAGE + 1;
            let endIndex = startIndex + PER_PAGE - 1;
            if (endIndex > numberOfRecords) {
                endIndex = numberOfRecords;
            }

            res.render('admin/order/view', {
                layout: 'admin/layouts/main',
                userFullname: user.fullName,
                address: address.address,
                orderDetails: orderDetails.rows,
                total: order.total,
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
}

export default new OrderController();