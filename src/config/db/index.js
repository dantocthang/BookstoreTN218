import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost/f8_page');
        console.log("Connect successfully")
    }
    catch (err){

    }
}

export default connect