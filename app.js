var createError = require('http-errors')
var session = require('express-session')
var flash = require('express-flash')
var express = require('express')
var logger = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var db = require('./database')
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hetalsingh332@gmail.com',
    pass: 'clajxcgikbzwdhvj'
  }
});


var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: '123@123abc',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
)
app.use(flash())
app.get('/', function (req, res, next) {
  res.render('index', { title: 'User Form' })
})

app.post('/user_form', function (req, res, next) {
  var name = req.body.name
  var email = req.body.email

  const msg1 = "Hi"
  
  const msg2 = "Thank you for subscribe us!"

  const email_text = msg1.concat(" ").concat(name).concat(", ").concat(msg2)

  var sql = `INSERT INTO users (user_name, email) VALUES ("${name}", "${email}")`
  db.query(sql, function (err, result) {
    if (err) {
      throw err
    }
    else{

      var mailOptions = {
        from: 'hetalsingh332@gmail.com',
        to: email,
        subject: 'Thank you ',
        text: email_text
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.json([{
            message: 'There is some issue, please try again later!',
            status: 'error'
         }])
        } else {
          res.json([{
            message: 'Thank you for getting in touch!',
            status: 'success'
         }])
        }
      });  
    }
  })
})
app.use(function (req, res, next) {
  next(createError(404))
})
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})
app.listen(3001, function () {
  console.log('Node server is running on port : 3001')
})
module.exports = app