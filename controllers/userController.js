const User = require('../models/user');
const Jabatan = require('../models/jabatan');
const bcrypt = require('bcrypt');

const saltRounds = 10;

class UserController {
    static async renderRegister(req, res) {
        const jabatan = await Jabatan.find();
        res.render('users/register', {jabatan});
    }

    static async register(req, res, next) {
        try {
            const { email, username, nip, jabatanID, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = new User({ username, email, password: hashedPassword, nip, jabatanID});
            await user.save();
            res.render('dashboard', {username});
        } catch (e) {
            next(e);
            res.redirect('/register');
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
