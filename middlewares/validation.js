const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}
