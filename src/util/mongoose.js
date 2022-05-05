
export const multipleMongooseToObject = function (mongooses) {
    return mongooses.map(m => m.toObject())
}
export const mongooseToObject = function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose
}


