import user from '../models/User.js';
import Address from '../models/address.js';

class UserController {    
    async getProfileInfo(req, res, next) {
        if(req.query.id){
            let userData = await user.findOne({
                where: { id: req.query.id}, 
                include: [Address]
            })
            console.log(userData);
            return res.render('profile/profileInfo.ejs', {user: userData});
        }
    }
}

const a = new UserController()

export default a