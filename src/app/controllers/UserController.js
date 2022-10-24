import { validationResult } from 'express-validator';

import User from '../models/User.js';
import Address from '../models/address.js';

class UserController {
    // [GET] /user/profile?id=
    async getProfileInfo(req, res, next) {
        if (req.query.id) {
            let user = await User.findByPk(req.query.id)
            let addresses = await Address.findAll({
                where: { userId: req.query.id }
            })
            return res.render('guest/auth/profile', { user: user, addresses: addresses });
        }
        return res.render('guest/auth/login', { error: req.flash('error') })
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
            await Address.update({name: req.body.address_name, address: req.body.address, phone: req.body.phone}, { where: { id: req.query.id } })
            return res.redirect(`/user/profile?id=${req.body.id}`);
        } catch (error) {
            next(error)
        }
    }
}

const a = new UserController()

export default a