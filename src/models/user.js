const mongoose = require('mongoose');

const { Schema } = mongoose;
const validator = require('mongoose-unique-validator');

const User = new Schema({
  name: { type: String, required: true, maxlength: 20 },
  lastname: { type: String, required: true, maxlength: 20 },
  age: { type: Number, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, mixlength: 6 },
  email: { type: String, unique: true, required: true },
  image: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

User.plugin(validator, { message: 'Error, {PATH} duplicated' });

// eslint-disable-next-line func-names
User.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

module.exports = mongoose.model('User', User);
