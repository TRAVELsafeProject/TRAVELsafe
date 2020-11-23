require('dotenv').config()

const bodyParser    = require('body-parser')
const cookieParser  = require('cookie-parser')
const express       = require('express')
const favicon       = require('serve-favicon')
const hbs           = require('hbs')
const mongoose      = require('mongoose')
const logger        = require('morgan')
const path          = require('path')
const bcrypt        = require('bcrypt')
const passport      = require('passport')
const localStrategy = require('passport-local').Strategy
const session       = require('express-session')
const flash         = require('connect-flash')

const User = require('./models/User')
const Comment = require('./models/Comment')
const Country = require('./models/Country')

const url = `mongodb+srv://${process.env.USUARIO}:${process.env.PASSWORD}@cluster0.r7cqo.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

mongoose
  .connect(url,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware session
app.use(session({secret: 'ourPassword', resave: true, saveUninitialized: true}))

// Middleware para seliarizar al usuario

passport.serializeUser((user, callback) => {
  callback(null, user._id)
})

// Middleware para des-seliarizar al usuario

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => callback(null, user))
    .catch((err) => callback(err))
})

// Middleware de flash

app.use(flash())

// Middleware de la Strategy

passport.use(new localStrategy({passReqToCallback: true, usernameField: 'email'}, (req, email, password, next) => {
  User.findOne({email})
    .then((user) => {

      if(!user) {
        return next(null, false, {message: 'Wrong email or password.'})
      } 

      if(!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {message: 'Wrong email or password.'})
      }

      return next(null, user)
    })
    .catch((err) => next(err))
}))

// Middleware de passport

app.use(passport.initialize())
app.use(passport.session())

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'TRAVELsafe';

const index = require('./routes/index');
app.use('/', index);

const user = require('./routes/user');
app.use('/', user); //SI ESTO ESTÁ REQUERIDO ENCIMA DE LAS DEMÁS RUTAS, NO SE PODRÁ ACCEDER SIN HACER EL LOG IN?

module.exports = app;
