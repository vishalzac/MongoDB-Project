const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/youtubeRegistration').then(() => {
    console.log('connection is sucessfull')
}).catch((e) => {
    console.log(`e`)
})