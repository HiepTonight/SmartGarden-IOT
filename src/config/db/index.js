const mongoose = require('mongoose');

async function connect(){

    try {
        await mongoose.connect('mongodb+srv://hieptram40:123@cluster0.02rer4y.mongodb.net/Mangcambien_dev?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        console.log('Kết nối với DB thành công !!');
    } catch (error) {
        console.log('Kết nối với DB thất bại !!');

    }
    
}
//mongodb+srv://hieptram40:123@cluster0.02rer4y.mongodb.net/Mangcambien_dev?retryWrites=true&w=majority
//mongodb://localhost:27017/Mangcambien_end_dev
module.exports = { connect };
