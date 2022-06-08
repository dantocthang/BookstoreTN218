import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'

import User from '../app/models/User.js'
import { facebookKeys, googleKeys } from '../config/keys.js'

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
    passport.use(new GoogleStrategy.Strategy({
        clientID: googleKeys.clientID,
        clientSecret: googleKeys.clientSecret,
        callbackURL: googleKeys.callbackURL
    }, (request, accessToken, refreshToken, profile, done) => {
        console.log(profile)
        // Check if google profile exist.
        if (profile.id) {
            User.findOne({ googleId: profile.id })
                .then(async (existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        const hashedPassword = await bcrypt.hash(profile.emails[0].value, 10)
                        new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            name: profile.name.familyName + ' ' + profile.name.givenName,
                            username: profile.name.familyName + ' ' + profile.name.givenName,
                            password: hashedPassword,
                            image: profile.photos[0].value
                        })
                            .save()
                            .then(user => done(null, user));
                    }
                })
        }
    }
    ))
    passport.use(new FacebookStrategy.Strategy({
        clientID: facebookKeys.facebook_key,
        clientSecret: facebookKeys.facebook_secret,
        callbackURL: facebookKeys.callback_url,
        profileFields: ['id', 'displayName', 'photos']
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log(profile)
                if (profile.id) {
                    User.findOne({ facebookId: profile.id })
                        .then(async (existingUser) => {
                            if (existingUser) {
                                done(null, existingUser);
                            } else {
                                const hashedPassword = await bcrypt.hash(profile.id, 10)
                                new User({
                                    facebookId: profile.id,
                                    // email: profile.emails[0].value,
                                    // name: profile.name.familyName + ' ' + profile.name.givenName,
                                    username: profile.displayName,
                                    password: hashedPassword,
                                    image: profile.photos[0].value
                                })
                                    .save()
                                    .then(user => done(null, user));
                            }
                        })
                }          
            });
        }
    ));






    // Cach dung
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((_id, done) => {
        User.findById(_id, (err, user) => {
            if (err) {
                done(null, false, { error: err });
            } else {
                done(null, user);
            }
        });
    });
}

export default initializePassport