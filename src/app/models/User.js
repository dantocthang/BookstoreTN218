import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete'

const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    // username: { type: String},
    // password: { type: String},
    email: {type: String},
    googleId: {type: String},
    image: { type: String },
    role: { type: String },
    deletedAt: { type: Date },
}, { timeStamp: true });




// Plugin
User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('User', User);