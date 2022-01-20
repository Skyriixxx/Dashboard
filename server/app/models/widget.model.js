const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema({
    
});

const Widget = mongoose.model('Widget', WidgetSchema);

module.exports = Widget;