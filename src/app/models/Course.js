import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator'
import mongooseDelete from 'mongoose-delete' // Soft delete
const Schema = mongoose.Schema;
mongoose.plugin(slug)

const Course = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String},
    slug: {type: String, slug: 'name', unique: true},
    videoId: {type: String},
    level: {type: String},
    deletedAt: {type: Date},
  },{ timestamps: true});

  // Plugin
  Course.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
  })

  export default mongoose.model('Course', Course);