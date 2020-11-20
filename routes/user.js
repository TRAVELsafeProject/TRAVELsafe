const express     = require('express')
const router      = express.Router()
const bcrypt      = require('bcrypt')
const passport    = require('passport')
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')


//RUTA GET DE SIGN UP

router.get('/sign-up', (req, res, next) => {
  res.render('Users/signup')
})


//RUTA POST DE SIGN UP

router.post('/sign-up', (req, res, next) => {

    const {name, email, password} = req.body
  
    if(name === '' || email === '' || password === '') {
      res.render('Users/signup', {errorMessage: 'You have to fill all the fields.'})
      return
    }
  
    User.findOne({email})
      .then((result) => {
        if(!result) {
          bcrypt.hash(password, 10)
          .then((hashedPassword) => {
            User.create({name, email, password: hashedPassword})
              .then(() => res.redirect('/log-in'))
          })
        } else {
          res.render('Users/signup', {errorMessage: 'This user already exists. Please, try again.'})
        }
      })
      .catch((err) => res.send(err))
})


//RUTA GET DE LOG IN

router.get('/log-in', (req, res, next) => {
    res.render('Users/login', {errorMessage: req.flash('error')})
})
  

//RUTA POST DE LOG IN

router.post('/log-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
    passReqToCallback: true
}))


//RUTA GET DE LOG OUT
router.get('/log-out', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

router.get('/my-profile', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  res.render('Users/myProfile', {user: req.user})
})



module.exports = router;