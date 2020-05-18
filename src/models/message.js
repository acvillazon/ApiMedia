const mongoose = require('mongoose');

const { Schema } = mongoose;

const Message = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  dest: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, maxlength: 500 },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Message', Message);
