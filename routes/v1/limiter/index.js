const rateLimit = require("express-rate-limit");

exports.api = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 400,
  message: JSON.stringify({ status: "error", message: 'Too many requests' })

});
exports.account = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 300,
  message: JSON.stringify({ status: "error", message: 'Too many requests' })

});
exports.login = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100,
  message: JSON.stringify({ status: "error", message: 'Too many requests' })
});
