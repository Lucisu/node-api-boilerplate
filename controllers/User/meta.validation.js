const { check } = require('express-validator/check');
const validation = require("../../middlewares/validation");
exports.validate = (method) => {
  return getValidations(method);
}

function getValidations(method){
  let valid = []
  switch (method) {
    case "find":
      valid = [
        check('email', 'E-mail inválido').isEmail(),
        check('password')
          .isLength({ min: 6 }).withMessage('ao menos 6 caracteres')
          .matches(/\d/).withMessage('precisa conter um número'),
      ];
      break;
    case "forgotPassword":
      valid = [
        check('password').optional()
          .isLength({ min: 6 }).withMessage('ao menos 6 caracteres')
          .matches(/\d/).withMessage('precisa conter um número'),
      ];
      break;
  }
  valid.push(validation);
  return valid;

}
