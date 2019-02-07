const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const v1    = require('./routes/v1');
var cors = require('cors');

const helmet = require('helmet')

Date.prototype.toJSON = function(){ return this.toLocaleString(); }
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require("./routes/v1/limiter").api);


const expressValidator = require('express-validator');
const db = require('./config/db.config.js');

// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
});

app.use(cors());
//app.use(express.static('public'));

app.use(function(req, res, next) {


  res.sendJson = function (args, code=200) {

    if (typeof args !== "string") {
      args.code = typeof args.code !== 'undefined' ? args.code : 200;
      args.message = typeof args.message !== 'undefined' ? args.message : null;
      args.data = typeof args.data !== 'undefined' ? args.data : null;
      success = [200,201,202];
      args.status = success.indexOf(args.code) != -1 ? "ok" : "error";
      for (var propName in args) {
        if (args[propName] === null || args[propName] === undefined) {
          delete args[propName];
        }
      }
      const { code, ...response } = args;
      res.status(args.code).json(response);
    }else{
      success = [200,201,202];
      status = success.indexOf(code) != -1 ? "ok" : "error";
      res.status(code).json({status, "message": args});
    }
    return 1;

  }
  next();
})


app.use('/v1', v1);
app.use('/v1/uploads',express.static('uploads'))

app.use(cors());
app.use(expressValidator());

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    return res.status(400).json({status: "error", message: "Invalid body"});
  } else {
    return res.status(500).json({status: "error", message: "Server error"});

  }
});

app.use(function(req, res, next){
  res.sendJson("Not Found: ["+req.method+"] " + req.originalUrl, 404);
})
// Create a Server
const server = app.listen(process.env.PORT || 5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
})

module.exports = app;
