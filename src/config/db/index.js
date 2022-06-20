import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connect successfully")
    }
    catch (err){

    }
}

export default connect