import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete'
const Schema = mongoose.Schema;

const UploadFile = new Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    deletedAt: { type: Date },
}, { timestamps: true });

// Plugin
UploadFile.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
})

export default mongoose.model('UploadFile', UploadFile);