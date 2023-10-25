const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const UserController = require('../controllers/userController');


router.route('/register')
    .get(UserController.renderRegister)
    .post(catchAsync(UserController.register));

router.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), UserController.login);

router.route('/logout')
    .get(UserController.logout);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const catchAsync = require('../utils/catchAsync');
// const UserController = require('../controllers/userController');

// router.get('/register', UserController.renderRegister);

// router.post('/register', catchAsync(UserController.register));

// router.get('/login', UserController.renderLogin);

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), UserController.login);

// router.get('/logout', UserController.logout);

// module.exports = router;



// ---------------------------------------------------


// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const catchAsync = require('../utils/catchAsync');
// const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } = require('../controllers/users');

// router.get('/register', renderRegisterForm);

// router.post('/register', catchAsync(registerUser));

// router.get('/login', renderLoginForm);

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUser);

// router.get('/logout', logoutUser);

// module.exports = router;








// ----------------------------------------------------



// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const catchAsync = require('../utils/catchAsync');
// const User = require('../models/user');

// router.get('/register', (req, res) => {
//     res.render('users/register');
// })
// router.post('/register', catchAsync(async (req, res) => {
//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//             req.flash('success', 'Welcome to Yelp Camp!');
//             res.redirect('/campgrounds');
//         })
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('register');
//     }
// }))

// router.get('/login', (req, res) => {
//     res.render('users/login');
// })

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//     req.flash('success', 'welcome back!');
//     const redirectUrl = req.session.returnTo || '/campgrounds';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// })


// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/campgrounds');
// })



// module.exports = router;