const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
content: {
type: String,
required: true
},
date: {
type: Date,
default: Date.now
},
completed: {
type: Boolean,
default: false,
required: true
}
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);