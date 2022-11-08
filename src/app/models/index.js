import User from './user.js'
import Address from './address.js'
import Book from './book.js'
import Author from './author.js'
import Category from './category.js'
import Image from './image.js'
import Publisher from './publisher.js'
import Order from './order.js'
import OrderDetail from './order-detail.js'
import Wishlist from './wishlist.js'
import CartDetail from './cart-detail.js'
import Review from './review.js'
import Transcation from './transaction.js'


const associationDefiner = () => {
    // Author x Book: One to Many
    Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' })
    Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' })

    // Category x Book: One to Many 
    Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' })
    Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

    // Book x Image: One to Many 
    Book.hasMany(Image, { foreignKey: 'bookId', as: 'images' })
    Image.belongsTo(Book, { foreignKey: 'bookId', as: 'book' })

    // Publisher x Book: One to Many 
    Publisher.hasMany(Book, { foreignKey: 'publisherId', as: 'books' })
    Book.belongsTo(Publisher, { foreignKey: 'publisherId', as: 'publisher' })

    // User x Addresss: One to Many 
    User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' })
    Address.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // User x Order: One to Many 
    User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
    Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // Order x Address: Many to One
    Address.hasMany(Order, { foreignKey: 'addressId', as: 'orders' })
    Order.belongsTo(Address, { foreignKey: 'addressId', as: 'address' })

    // User x Review: One to Many 
    User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' })
    Review.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // Book x Review: One to Many 
    Book.hasMany(Review, { foreignKey: 'bookId', as: 'reviews' })
    Review.belongsTo(Book, { foreignKey: 'bookId', as: 'book' })

    // User x Wishlist: One to Many 
    User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' })
    Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // Book x Wishlist: One to Many 
    Book.hasMany(Wishlist, { foreignKey: 'bookId', as: 'wishlists' })
    Wishlist.belongsTo(Book, { foreignKey: 'bookId', as: 'book' })

    // Order x OrderDetail: One to Many
    Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'orderDetails', onDelete: 'CASCADE' })
    OrderDetail.belongsTo(Order, { foreignKey: 'orderId', as: 'order' })

    // User x CartDetail: One to Many 
    User.hasMany(CartDetail, { foreignKey: 'userId', as: 'cartDetails' })
    CartDetail.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // Book x CartDetail: One to Many
    Book.hasMany(CartDetail, { foreignKey: 'bookId', as: 'cartDetails' })
    CartDetail.belongsTo(Book, { foreignKey: 'bookId', as: 'book' })

    // User x Transcation: One to Many
    User.hasMany(Transcation, { foreignKey: 'userId', as: 'transcation' })
    Transcation.belongsTo(User, { foreignKey: 'userId', as: 'user' })

    // // Order x Transcation: One to One
    // Order.hasOne(Transcation, {foreignKey: 'orderId', as: 'transcation'})
    // Transcation.belongsTo(Order, { foreignKey: 'orderId', as: 'order' })
}

export default associationDefiner