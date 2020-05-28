const jwt = require('jsonwebtoken');

exports.authorize = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: "The request not contains authorization's header" });
  }

  // Verificar
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.KEY_TOKEN, (err, decode) => {
    if (err) {
      return res.status(400).json({
        message: 'It has occurred an error by the token given',
        error: { name: err.name, message: err.message },
      });
    }

    req.user = decode;
    next();
    return null;
  });

  return null;
};

// /THIS IS NOT A MIDDLEWARE
exports.createToken = (user) => {
  const token = jwt.sign(
    {
      user,
    },
    process.env.KEY_TOKEN,
    { expiresIn: 60 * 60 * 24 * 7 }
  );

  return token;
};
