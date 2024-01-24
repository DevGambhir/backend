const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: {
        type: String,
        required: true,
        
        
    },
    price: {
        type: String,
        
        
    },
    marketCap: {
        type: String,
        
        
    },
    change: {
        type: String,
        
        
    },
    pricetag: {
        type: Number,
        
        
        
    },
    image:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', notesSchema);