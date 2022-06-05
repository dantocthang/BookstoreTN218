import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

import User from '../app/models/User.js'

function initializePassport(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({ username: username })
        if (user == null) {
            return done(null, false, { message: 'Tên người dùng không tồn tại' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else {
                return done(null, false, { message: 'Mật khẩu không đúng' })
            }
        } catch (e) {
            return done(e)
        }
    }


    passport.use(new LocalStrategy.Strategy({ usernameField: 'username' }, authenticateUser))
    // passport.serializeUser((user, done) => done(null, user._id))
    // passport.deserializeUser((id, done) => {
    //     return done(null, User.findOne({ _id: id }))
    // })



    // Cach dung
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser((_id, done) => {
      User.findById( _id, (err, user) => {
        if(err){
            done(null, false, {error:err});
        } else {
            done(null, user);
        }
      });
    });
}

export default initializePassport