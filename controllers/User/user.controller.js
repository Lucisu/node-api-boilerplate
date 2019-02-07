const db = require('../../config/db.config.js');
const User = db.users;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validation = require('./user.validation.js');
const config = require("../../config/config.json");

const multer  = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const randomstring = require("randomstring");

function generateToken(params){
  return jwt.sign({userId: params}, process.env.JWT_SECRET,{

  })
}


exports.upload = (req, res, err) => {

  const id = req.jwtUserId;

  User.findOne({where: {id}}).then((user) => {
    if (user) {
      User.update({photo:req.file.filename},{where:{id}}).then((user1) => {
        res.sendJson("Sucesso");
      }).catch(e => {
        console.log(e);
        res.sendJson("Erro",500);
      })
    }else{
      res.sendJson("Erro",500);
    }
  })
}
exports.uploadMulter = multer({

  fileFilter: function (req, file, cb) {

    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("");
  },
  limits: {
    fileSize: parseInt(config.maxUserUploadSize),
    files: parseInt(config.maxUserUploadFiles),
  },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let type = 'user';
      let path = `./uploads/${type}s`;
      // fs.mkdirsSync(path);
      callback(null, path);
    },
    filename: (req, file, callback) => {
      //originalname is the uploaded file's name with extn
      const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;

      callback(null, newFilename);
    },

  })
});

exports.create = (req, res) => {
  try {
    User.findOne({where: {email: req.body.email}}).then(user=>{
      if (user){
        res.sendJson("E-mail já cadastrado.",409);
      }else{
        var hashedPassword = bcrypt.hashSync(req.body.password, 10);
        User.create({
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          age: req.body.age,
          address: req.body.address,
          password: hashedPassword,
          token: "",
          roles: req.body.roles | 1
        }).then(user => {
          user.token = generateToken(user.id);
          user.password = undefined;

          res.json(user);
        });
      }
    });
  } catch (e) {
      console.log(e);
      res.sendJson("Parâmetro ausente.",400);
  }
};
exports.login = (req, res) => {
	User.findOne({where: {email:req.body.email}}).then(user=>{
    if (user){
      bcrypt.compare(req.body.password, user.password).then(function(resp) {
          if (resp){
            user.token = generateToken(user.id);
            res.sendJson({"data":user.show()});
          }else{
            res.sendJson("Login inválido",401);
          }
      }).catch(e => {
        console.log(e);
      })
    }else{
      res.sendJson("Login inválido",401);

    }
	})
};

exports.forgotPassword = (req, res) => {
  if (req.body.method === 'sendToken') {
    User.findOne({where: {email:req.body.email}}).then(user=>{
      if (user){
        let generatedToken = randomstring.generate(27);
        User.update({password_recovery: generatedToken, password_recovery_time: Date.now()},{where: {id: user.id}}).then(user1 => {
          if (user1) {
            res.sendJson("Sucesso");
          }else {
            res.sendJson("Um Erro Ocorreu.",400);
          }
        })
      }else{
        res.sendJson("E-mail inválido.",401);
      }
    });
  }else if(req.body.method === 'recovery' && typeof req.body.password !== 'undefined'){
  	User.findOne({where: {password_recovery:req.body.token}}).then(user=>{
      if (user){
        try {
          const ONE_HOUR = 3600000; /* ms */
          var date1 = new Date(user.password_recovery_time);
          var timeDiff = Math.abs(date1.getTime() - Date.now());
          var diff = Math.ceil(timeDiff);
          if (diff <= ONE_HOUR) {
            var hashedPassword = bcrypt.hashSync(req.body.password, 10);

            User.update({password: hashedPassword,password_recovery: ''},{where: {id: user.id}}).then(user1 => {
              if (user1) {
                res.sendJson("Senha redefinida.",200);
              }else {
                res.sendJson("Um Erro Ocorreu.",400);
              }
            })
          }else{
            res.sendJson("Token Expirado.",400);
          }
        } catch (e) {
          res.sendJson("Token Expirado.",400);
        }
      }else{
        res.sendJson("Token inválido.",401);
      }
  	})
  }else{
    res.sendJson("",400);
  }
};
exports.update = (req, res) => {
	const id = req.jwtUserId;
  if (!req.body.first_name || !req.body.last_name || !req.body.address || !req.body.email || !req.body.password){
    return res.sendJson("Erro",400);
  }
  var hashedPassword = bcrypt.hashSync(req.body.password, 10);

  User.findOne({where: {id}}).then((user)=> {
    if (!user){
      return res.sendJson("Não Encontrado.",404);
    }else{
      User.update( { first_name: req.body.first_name, last_name: req.body.last_name, address: req.body.address,
                      email: req.body.email, password: hashedPassword},
    					 { where: {id} }
             ).then((user) => {
               User.findOne({where: {id}}).then((userResp)=> {
                 if (userResp){
                   res.send(userResp);
                 }
               })
    				  });
    }
  });


};

function makeid(l = 12) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < l; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.validate = (method) => {
  return validation.validate(method);
}

exports.test = (req, res) => {
  res.sendJson({"message": "hello world"});
}
