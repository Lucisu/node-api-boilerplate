const db = require('../config/db.config.js');
const BannedUser = db.banned_users;
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).send({ error: "No token provided" });

  const parts = authHeader.split(' ');


  if (!parts.length === 2)
    return res.status(401).send({ error: "Token error" });

  const [ scheme, token] = parts;

  if (! /^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformatted" });

  jwt.verify(token, process.env.JWT_SECRET,(err,decoded) =>{
    if (err)
      return res.status(401).send({ error: "Token Invalid" });

    BannedUser.findOne({where:{user_id: decoded.userId}}).then(banned => {
      if (banned) {
        let until = new Date(banned.until_date).toLocaleString();
        let today = new Date().toLocaleString();

        if (banned.status === "active" && until > today) {
          return res.sendJson("You're banned. Reason: " + banned.reason + " - Back on " + until, 401);
        }else{
          req.jwtUserId = decoded.userId;
          return next();
        }
      }else {
        req.jwtUserId = decoded.userId;
        return next();
      }
    })


  })

}
