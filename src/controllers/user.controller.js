/* eslint-disable consistent-return */
const l = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { createToken } = require('../middleware/authorize');

exports.signIn = (req, res) => {
  try {
    const fields = l.pick(req.body, [
      'name',
      'lastname',
      'age',
      'email',
      'password',
      'username',
    ]);

    fields.password = bcrypt.hashSync(fields.password, 10);
    const user = new User(fields);

    user.save().then(
      (value) => {
        res.status(201).json({
          value,
          message: 'User was saved',
          token: createToken(value),
        });
      },
      (err) => {
        res.status(500).json({ err });
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.logIn = async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email }).populate(
      'friends',
      'name lastname username email _id image'
    );
    if (user.length === 0) {
      return res.status(400).json({ message: 'Authentication error' });
    }

    // /Verify Contraseña
    if (!req.body.password) {
      return res.status(400).json({ message: 'Username or password invalid' });
    }

    const pass = Object.values(user)[0].password;
    const valid = bcrypt.compareSync(req.body.password, pass);

    if (!valid) {
      return res.status(400).json({ message: 'Username or password invalid' });
    }

    res.status(200).json({ user: user[0], token: createToken(user[0]) });
  } catch (error) {
    res.json({ error });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  const populate = !!req.query.populate;
  const fields = req.query.fields ? req.query.fields : undefined;
  const exist = !!req.query.exist;

  try {
    if (populate) {
      User.findById(id)
        .populate('friends', ['name lastname _id username email image'])
        .exec((err, document) => {
          if (!document) {
            return res.status(400).json({ err: { message: 'User not found' } });
          }

          if (exist) {
            return res
              .status(200)
              .json({ message: 'The user exist in database', code: 100 });
          }

          const userObject = fields ? l.pick(document, fields.split(',')) : document;

          res.status(200).json({ user: userObject });
        });
    } else {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ err: { message: 'User not found' } });
      }
      const userObject = fields ? l.pick(user, fields.split(',')) : user;

      res.status(200).json({ user: userObject });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getExist = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ email: id });
    if (!user) {
      return res.status(200).json({ found: false });
    }

    res.status(200).json({ found: true });
  } catch (err) {
    res.status(500).json({ err });
  }
};
