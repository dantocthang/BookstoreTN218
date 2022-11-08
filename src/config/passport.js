import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'

import User from '../app/models/user.js'
import { facebookKeys, googleKeys } from '../config/keys.js'

function initializePassport(passport) {
    // Xác thực user đăng nhập bằng Google
    passport.use(new GoogleStrategy.Strategy({
        clientID: googleKeys.clientID,
        clientSecret: googleKeys.clientSecret,
        callbackURL: googleKeys.callbackURL
    }, (request, accessToken, refreshToken, profile, done) => {
        // Check if google profile exist.
        if (profile.id) {
            User.findOne({ where: { googleId: profile.id } })
                .then(async (existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        const user = await User.create({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            fullName: profile.name.familyName + ' ' + profile.name.givenName,
                        })
                        done(null, user)
                        // new User({
                        //     googleId: profile.id,
                        //     email: profile.emails[0].value,
                        //     fullName: profile.name.familyName + ' ' + profile.name.givenName,
                        // })
                        //     .save()
                        //     .then(user => done(null, user));
                    }
                })
        }
    }
    ))


    // Xác thực user đăng nhập bằng Facebook
    passport.use(new FacebookStrategy.Strategy({
        clientID: facebookKeys.facebook_key,
        clientSecret: facebookKeys.facebook_secret,
        callbackURL: facebookKeys.callback_url,
        profileFields: ['id', 'displayName', 'photos']
    },
        function (accessToken, refreshToken, profile, done) {
            // console.log(profile)
            process.nextTick(function () {
                if (profile.id) {
                    User.findOne({ where: { facebookId: profile.id } })
                        .then(async (existingUser) => {
                            if (existingUser) {
                                done(null, existingUser);
                            } else {
                                const user = await User.create({
                                    facebookId: profile.id,
                                    // email: profile.emails[0].value,
                                    fullName: profile.displayName,
                                    image: profile.photos[0].value
                                })
                                // new User({
                                //     facebookId: profile.id,
                                //     username: profile.displayName,
                                //     password: hashedPassword,
                                //     image: profile.photos[0].value
                                // })
                                //     .save()
                                //     .then(user => done(null, user));
                            }
                        })
                }
            });
        }
    ));






    // Cach dung
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default initializePassport