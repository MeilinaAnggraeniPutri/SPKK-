const User = require('../models/user');

class UserController {
    static renderRegister(req, res) {
        res.render('users/register');
    }

    static async register(req, res, next) {
        try {
            const { email, username, password } = req.body;
            const user = new User({ email, username });
            console.log(user)
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Welcome to Yelp Camp!');
                res.redirect('/login');
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('register');
        }
    }

    static renderLogin(req, res) {
        res.render('users/login');
    }

    static login(req, res) {
        req.flash('success', 'welcome back!');
        const redirectUrl = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }

    static logout(req, res) {
        req.logout();
        req.flash('success', "Goodbye!");
        res.redirect('/login');
    }
}

module.exports = UserController;
