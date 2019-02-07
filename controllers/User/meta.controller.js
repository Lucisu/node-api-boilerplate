const db = require('../../config/db.config.js');
const UserMeta = db.users_meta;

const validation = require('./meta.validation.js');

exports.add = (req, res) => {
  try {
    UserMeta.findOne({where: {type: req.body.type, user_id: req.jwtUserId}}).then(userMeta=>{
      if (userMeta){
        UserMeta.update(req.body,{where:{type: userMeta.type, user_id: userMeta.user_id}}).then(newUserMeta => {
          if (newUserMeta) {
            res.sendJson("Sucesso");
          }else {
            res.sendJson("Falha");
          }
        });
      }else{
        UserMeta.create({user_id: req.jwtUserId, ...req.body}).then(newUserMeta => {
          if (newUserMeta) {
            res.sendJson("Sucesso");
          }else {
            res.sendJson("Falha");
          }
        }).catch(err => {
          res.sendJson("Falha", 500);
        })
      }
    });
  } catch (e) {
      console.log(e);
      res.status(400).json(cresponse.jres(400,"Parâmetro ausente"));
  }
};

exports.delete = (req, res) => {
  UserMeta.destroy({where: {user_id: req.jwtUserId, type: req.body.type}}).then(result => {
    if (result) {
      res.sendJson("Sucesso");
    }else{
      res.sendJson("Falha");
    }
  })
}

exports.find = (req, res) => {

  UserMeta.findAll({where: {
    user_id:req.jwtUserId,
    ...(req.body.type && {type: req.body.type}),
    ...(req.body.value && {value: req.body.value}),
   } } ).then(result => {
    if (result) {
      res.sendJson({data: result});
    }else{
      res.sendJson("",400);
    }
  }).catch( err => {
    res.sendJson("",400);

  })
}

exports.validate = (method) => {
  return validation.validate(method);
}
