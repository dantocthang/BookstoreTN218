import user from '../models/User.js';
import address from '../models/address.js';

class UserController {    
    async getProfileInfo(req, res, next) {
        if(req.query.id){
            let userData = await user.findOne({
                where: { id: req.query.id}, 
            })
            let addressData = await address.findOne({
                where: { user_id: req.query.id}
            })
            return res.render('profile/profileInfo.ejs', {user: userData, address: addressData});
        }
        return res.render('auth/login', { error: req.flash('error') })
    }

    async updateProfileInfo(req, res, next) {
        let data = req.body;

        let userData = await user.findOne({
            where: { id: data.id}, 
        })
        let addressData = await address.findOne({
            where: { user_id: data.id}
        })

        userData.fullName = data.name;
        userData.email = data.email;
        userData.phone = data.phone;
        addressData.name = data.address_name;
        addressData.address = data.address;

        try {
            userData.save();
            addressData.save();
        } catch (e) {
            console.log(e);
        }

        return res.redirect('/user/profile?id='+data.id);
    }
}

const a = new UserController()

export default a