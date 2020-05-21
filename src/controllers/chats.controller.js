const l = require('lodash');
const { ObjectId } = require('mongoose').Types;
const Pending = require('../models/pending');
const BackUp = require('../models/backUp');
const User = require('../models/user');

exports.createBackUp = (req, res) => {
  try {
    const { user } = req;
    const chats = req.body.chat;
    new BackUp({
      // eslint-disable-next-line no-underscore-dangle
      user: user._id,
      messages: chats,
      date: `${new Date().getTime()}`,
    }).save();
    res.status(200).json({ Message: 'backup uploaded!' });
  } catch (error) {
    res.status(500).json({
      Message: 'It has occurred an error during the creation of backUp',
    });
  }
};

exports.getBackUp = async (req, res) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const backup = await BackUp.find({ user: req.user._id });
    if (backup.length === 0) {
      res.status(400).json({ err: { message: "Any backups copy wasn't found." } });
    }

    res.status(200).json({ backup });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

exports.createPending = (messages) => {
  try {
    const Mess = new Pending({
      user: ObjectId(messages.user),
      dest: ObjectId(messages.dest),
      message: messages.message,
      date: `${new Date().getTime()}`,
    });

    // eslint-disable-next-line no-unused-vars
    Mess.save((erro, _) => {
      if (erro) {
        return {
          err: { erro, message: 'It has occurred an error saving the message' },
        };
      }
      return { message: 'the message was saved' };
    });
  } catch (error) {
    return { error, err: { message: 'It has occurred an internal error' } };
  }
};

exports.deletePending = async (req, res) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const id = req.user.user._id;

    const pending = await Pending.deleteMany({ dest: id });

    if (!pending) {
      return res.status(400).json({
        err: {
          message: `There aren't messages to eliminate`,
        },
      });
    }
    res.status(203).json({ mesage: 'The pending was removed' });
  } catch (error) {
    res.status(500).json({ err: error });
  }
};

exports.addFriend = (req, res) => {
  const { friend } = req.body;

  User.findOne({ $or: [{ email: friend }, { username: friend }] }).exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({ mesage: 'The user was not found!' });
    }

    const own = req.user.user;
    own.friends.push(data);

    User.findOneAndUpdate(
      { email: own.email },
      { $set: { friends: own.friends } },
      { new: true },
      // eslint-disable-next-line no-unused-vars
      (errr, _) => {
        if (err) {
          return res.status(400).json({ errr, mesage: 'The user was not found!' });
        }

        res.status(200).json({
          User: l.pick(data, ['_id', 'name', 'username', 'email', 'lastname', 'image']),
          mesage: `Now, the user ${data.name} belongs to your friends list`,
        });
      }
    );
  });
};

exports.getPending = async (req, res) => {
  try {
    // eslint-disable-next-line no-underscore-dangle
    const me = req.user.user._id;
    const Pendings = await Pending.find({ dest: me });
    // eslint-disable-next-line no-unused-expressions
    Pendings.length !== 0
      ? res.status(200).json({ Pendings })
      : res.status(203).json({ message: 'There aren´t messages pending' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
