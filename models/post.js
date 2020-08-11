const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);