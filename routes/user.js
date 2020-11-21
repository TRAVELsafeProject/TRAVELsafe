const express     = require('express')
const router      = express.Router()
const bcrypt      = require('bcrypt')
const passport    = require('passport')
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')
const Comment = require('../models/Comment')

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

// CHECK FOR AUTHENTICATION

const checkAuth = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/log-in')
  }
}

//RUTA GET DE PROFILE

router.get('/my-profile', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  res.render('Users/myProfile', {user: req.user})
})


//RUTA GET CIUDAD

router.get('/:city', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next)=>{
  const city = req.params.city
  res.render('Users/city', {city})
})

//RUTA POST DE ADD WISH CITY

router.post('/add-wish-city/:city', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const city = req.params.city
  const wishVisitCities = req.user.wishVisit
  const index = wishVisitCities.indexOf(city)

  User.findOne({email: req.user.email})
    .then(() => {
      if (wishVisitCities.includes(city)) {
        wishVisitCities.splice(index, 1)
        User.updateOne({wishVisit: wishVisitCities})
          .then(() => {
              res.redirect(`/${city}`)
            })

      } else {
        User.updateOne({$push: {wishVisit: city}})
          .then(() => {
            res.redirect(`/${city}`)
          })
      }
    })
    .catch((err) => (err))
})

//RUTA POST DE ADD VISITED CITY

router.post('/add-visited-city/:city', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const city = req.params.city
  const visitedCities = req.user.alreadyVisited
  const index = visitedCities.indexOf(city)

  User.findOne({email: req.user.email})
    .then(() => {
      if (visitedCities.includes(city)) {
        visitedCities.splice(index, 1)
        User.updateOne({alreadyVisited: visitedCities})
          .then(() => {
            res.redirect(`/${city}`)
          })

      } else {
        User.updateOne({$push: {alreadyVisited: city}})
          .then(() => {
            res.redirect(`/${city}`)
          })
      }
    })
    .catch((err) => (err))
})

//RUTA GET DE COMMENTS

// router.get('/:city/city-comments', checkAuth, (req, res, next) => {

//   Comment.find({userID: req.user._id})
//     .then((result) => {
//       res.render('Users/cityComments', {comments: result})
//     })
//     .catch((err) => res.send(err))
// })

router.get('/create-comment/:city', checkAuth, (req, res, next)=>{
  const city = req.params.city
  res.render('Users/createComment', {city})
})

//RUTA GET DE CITY COMMENTS

router.get('/city-comments/:city', checkAuth, (req, res, next)=>{
  const city = req.params.city

  Comment.find({})
   .then((result) => {
    res.render('Users/cityComments', {city, comments: result})
   })
   .catch((err) => (err))
})

// router.get('/city-comments/:city', checkAuth, (req, res, next)=>{
//   const city = req.params.city
//   res.render('Users/cityComments', {city})
// })

//RUTA POST DE ADD COMMENT

router.post('/create-comment/:city', checkAuth, (req, res, next) => {
  const {commentTitle, comment, rating} = req.body
  const userID = req.user._id
  const city = req.params.city

  Comment.create({commentTitle, comment, rating, userID, cityName: city})
    .then(()=>{
      res.redirect(`/city-comments/${city}`)
    })
    .catch((err) => res.send(err))
})

module.exports = router;