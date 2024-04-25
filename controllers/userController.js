const User = require('../models/user');
const Jabatan = require('../models/jabatan');

class UserController {
    static async renderRegister(req, res) {
        if (req.session.isLogin) {
            res.redirect('/dashboard');
        } else {
            const jabatan = await Jabatan.find();
            res.render('users/register', {jabatan});
        }
    }

    static async register(req, res, next) {
        try {
            const { email, username, nip, jabatanID, password } = req.body;
            const user = new User({ username, email, password, nip, jabatanID});
            await user.save();

            req.session.isLogin = true;
            req.session.username = username;
            req.session.userId = user._id;

            res.redirect('/dashboard');
        } catch (e) {
            next(e);
            res.redirect('/register');
        }
    }

    static renderLogin(req, res) {
        if (req.session.isLogin) {
            res.redirect('/dashboard');
        } else {
            res.render('users/login');
        }
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username, password });

            if (user) {
                req.session.isLogin = true;
                req.session.username = username;
                req.session.userId = user._id;
                res.redirect('/dashboard');
            } else {
                res.redirect('/login');
            }
        } catch (e) {
            next(e);
        }
    }

    static logout(req, res) {
        res.redirect('/login');
    }
}

module.exports = UserController;
