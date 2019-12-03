const mongoose = require('mongoose');
const dbUrl = require('../../config/database').url

mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbUrl, { useNewUrlParser: true, useFindAndModify: false } , (err) => console.log('mongodb connected',err))

let messageSchema = mongoose.Schema({
    titre : {
        type: String,
        required: true},
    description : {
        type: String,
        required: true},
    image: {
        type: String,
    }
});

module.exports = mongoose.model('Article', messageSchema);