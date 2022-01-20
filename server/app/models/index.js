const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dbConfig = require('../config/db.config');

const db = {};
db.mongoose = mongoose;

db.user = require('./user.model');
db.widget = require('./widget.model');

db.mongoose.connect(`mongodb://hazbin:.@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database connected");
    // initial();
})
.catch(err => {
    console.error("Database connection error", err);
    process.exit();
});

module.exports = db;