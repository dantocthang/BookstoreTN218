import { validationResult } from 'express-validator';

import User from '../models/User.js';
import Address from '../models/address.js';

class UserController {
    // [GET] /user/profile?id=
    async getProfileInfo(req, res, next) {
        const currentUser = req.session.user || req.user || null
        if (currentUser) {
            let user = await User.findByPk(currentUser.id)
            let addresses = await Address.findAll({
                where: { userId: currentUser.id }
            })
            return res.render('guest/auth/profile', { user: user, addresses: addresses });
        }
        return res.redirect('/auth/login')
    }

    async updateProfileInfo(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.render('guest/auth/profile', { errors: errors.toArray() })
        try {
            await User.update(req.body, { where: { id: req.body.id } })
            return res.redirect(`/user/profile?id=${req.body.id}`);
        } catch (e) {
            next(e)
        }

        return res.redirect('/user/profile?id=' + data.id);
    }

    // [PUT] /user/profile/address
    async updateAddress(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.render('guest/auth/profile', { errors: errors.toArray() })

        try {
            await Address.update({ name: req.body.address_name, address: req.body.address, phone: req.body.phone }, { where: { id: req.query.id } })
            return res.redirect(`/user/profile?id=${req.body.id}`);
        } catch (error) {
            next(error)
        }
    }

    // [POST] /user/profile/address
    async addAddress(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.redirect(`/user/profile`)
        try {
            const currentUser = req.session.user || req.user || null
            if (!currentUser) return res.redirect('/auth/login')
            await Address.create({ name: req.body.address_name, address: req.body.address, phone: req.body.phone, userId: currentUser.id })
            return res.redirect('/user/profile')
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] /user/profile/address?id=
    async deleteAddress(req, res, next) {
        await Address.destroy({ where: { id: req.query.id } })
        return res.redirect('/user/profile')
    }
}

const a = new UserController()

export default a