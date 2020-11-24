const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User')
const Comment = require('../models/Comment')

//RUTA GET DE SIGN UP

router.get('/sign-up', (req, res, next) => {
  res.render('Users/signup')
})


//RUTA POST DE SIGN UP

router.post('/sign-up', (req, res, next) => {

  const {
    name,
    lastName,
    email,
    password
  } = req.body

  if (name === '' || lastName === '' || email === '' || password === '') {
    res.render('Users/signup', {
      errorMessage: 'You have to fill all the fields.'
    })
    return
  }

  User.findOne({
      email
    })
    .then((result) => {
      if (!result) {
        bcrypt.hash(password, 10)
          .then((hashedPassword) => {
            User.create({
                name,
                lastName,
                email,
                password: hashedPassword
              })
              .then(() => res.redirect('/log-in'))
          })
      } else {
        res.render('Users/signup', {
          errorMessage: 'This user already exists. Please, try again.'
        })
      }
    })
    .catch((err) => res.send(err))
})


//RUTA GET DE LOG IN

router.get('/log-in', (req, res, next) => {
  res.render('Users/login', {
    errorMessage: req.flash('error')
  })
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
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/log-in')
  }
}

//RUTA GET DE PROFILE

router.get('/my-profile', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  res.render('Users/myProfile', {
    user: req.user
  })
})


//RUTA GET CITY

router.get('/:city', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const city = req.params.city
  const userID = req.user._id
  const user = req.user

  Comment.find({cityName: city})
    .then((resultComments) => {
      User.findById(userID)
        .then((result) => {
          const visitedCities = result.alreadyVisited
          const wishVisitCities = result.wishVisit
          let addToWish = true
          let addToVisited = true
          if (visitedCities.includes(city)) {
            addToVisited = false
          } else {
            addToVisited = true
          }
          if (wishVisitCities.includes(city)) {
            addToWish = false
          } else {
            addToWish = true
          }

          Comment.find({cityName: city, userID})
          .then((resultComment)=>{
            // const userComment = resultComment.userID
            let noComment = false
            // console.log(resultComment)
            if(!resultComment) {
              noComment = false
            } else {
              noComment = true
            }
            res.render('Users/city', {city, user, addToWish, addToVisited, noComment: resultComment, comments: resultComments})
          })
          
        })
    })
    .catch((err) => (err))
})

//RUTA POST DE ADD WISH CITY

router.post('/add-wish-city/:city', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const city = req.params.city
  const wishVisitCities = req.user.wishVisit
  const wishVisitCitiesIndex = wishVisitCities.indexOf(city)
  const visitedCities = req.user.alreadyVisited
  const visitedCitiesIndex = visitedCities.indexOf(city)

  User.findOne({
      email: req.user.email
    })
    .then((result) => {

      const userID = result._id

      if (wishVisitCities.includes(city)) {
        wishVisitCities.splice(wishVisitCitiesIndex, 1)
        User.findByIdAndUpdate(userID, {
            wishVisit: wishVisitCities
          })
          .then(() => {
            res.redirect(`/${city}`)
          })
      } else if (!wishVisitCities.includes(city)) {
        User.findByIdAndUpdate(userID, {
            $push: {
              wishVisit: city
            }
          })
          .then(() => {
            res.redirect(`/${city}`)
          })
      }
      if (visitedCities.includes(city)) {
        visitedCities.splice(visitedCitiesIndex, 1)
        User.findByIdAndUpdate(userID, {
            alreadyVisited: visitedCities
          })
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
  const wishVisitCities = req.user.wishVisit
  const wishVisitCitiesIndex = wishVisitCities.indexOf(city)
  const visitedCities = req.user.alreadyVisited
  const visitedCitiesIndex = visitedCities.indexOf(city)

  User.findOne({
      email: req.user.email
    })
    .then((result) => {

      const userID = result._id

      if (visitedCities.includes(city)) {
        visitedCities.splice(visitedCitiesIndex, 1)
        User.findByIdAndUpdate(userID, {
            alreadyVisited: visitedCities
          })
          .then(() => {
            res.redirect(`/${city}`)
          })
      } else if (!visitedCities.includes(city)) {
        User.findByIdAndUpdate(userID, {
            $push: {
              alreadyVisited: city
            }
          })
          .then(() => {
            res.redirect(`/${city}`)
          })
      }
      if (wishVisitCities.includes(city)) {
        wishVisitCities.splice(wishVisitCitiesIndex, 1)
        User.findByIdAndUpdate(userID, {
            wishVisit: wishVisitCities
          })
          .then(() => {
            res.redirect(`/${city}`)
          })
      }


    })
    .catch((err) => (err))

})

//RUTAS DE CREATE COMMENTS

////      RUTA GET

router.get('/create-comment/:city', checkAuth, (req, res, next) => {
  const city = req.params.city
  const id = req.user._id
  const user = req.user

  Comment.findOne({
      userID: id,
      cityName: city
    })
    .then((result) => {
      console.log(result)
      if (!result) {
        res.render('Users/createComment', {user, city})
      } else {
        res.redirect(`/${city}`)
      }
    })
})

////      RUTA POST

router.post('/create-comment/:city', checkAuth, (req, res, next) => {
  const {
    commentTitle,
    comment,
    rating
  } = req.body
  const userID = req.user._id
  const city = req.params.city
  const name = req.user.name
  const lastName = req.user.lastName

  Comment.create({
      commentTitle,
      comment,
      rating,
      userID,
      name,
      lastName,
      cityName: city
    })
    .then(() => {
      res.redirect(`/${city}`)
    })
    .catch((err) => res.send(err))
})


//RUTA GET DE MY COMMENTS

router.get('/my-profile/my-comments', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const userID = req.user._id
  const name = req.user.name
  const user = req.user


  Comment.find({
      userID
    })
    .then((result) => {
      res.render('Users/myComments', {name, user, comments: result})
    })
    .catch((err) => res.send(err))
})


//RUTA DELETE DE MY COMMENTS
router.post('/my-profile/delete-comment/:id', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const commentId = req.params.id

  Comment.findByIdAndDelete(commentId)
    .then(() => {
      res.redirect('/my-profile/my-comments')
    })
    .catch((err) => res.send(err))
})

//RUTA PARA EDITAR MY COMMENTS

//RUTA GET DE EDIT MY COMMENTS

router.get('/my-profile/edit-comment/:id', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const commentId = req.params.id
  const user = req.user

  Comment.findById(commentId)
    .then((result) => {
      res.render('Users/editComment', {
        result,
        user
      })
    })
    .catch((err) => res.send(err))
})

//RUTA POST DE EDIT DE MY COMMENTS
router.post('/my-profile/edit-comment/:id', ensureLogin.ensureLoggedIn('/log-in'), (req, res, next) => {
  const commentId = req.params.id
  const editedComment = req.body

  Comment.findByIdAndUpdate(commentId, editedComment)
    .then(() => {
      res.redirect('/my-profile/my-comments')
    })
    .catch((err) => res.send(err))
})


module.exports = router;