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
        console.log(profile)
        // Check if google profile exist.
        if (profile.id) {
            User.findOne({ googleId: profile.id })
                .then(async (existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            fullName: profile.name.familyName + ' ' + profile.name.givenName,
                        })
                            .save()
                            .then(user => done(null, user));
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