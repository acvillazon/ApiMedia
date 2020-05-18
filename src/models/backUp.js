const mongoose = require('mongoose');

const { Schema } = mongoose;

const BackUp = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: Object, required: true }],
  date: { type: String, required: true },
});

module.exports = mongoose.model('BackUp', BackUp);
