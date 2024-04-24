const User = require('../models/user');
const Jabatan = require('../models/jabatan');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserController {
    static async renderRegister(req, res) {
        const jabatan = await Jabatan.find();
        res.render('users/register', {jabatan});
    }

    static async register(req, res, next) {
        try {
            const { email, username, nip, jabatanID, password } = req.body;
            const hashedPassword = bcrypt.hashSync(password, salt);
            const user = new User({ username, email, password: hashedPassword, nip, jabatanID});
            await user.save();
            res.redirect('/dashboard');
        } catch (e) {
            next(e);
            res.redirect('/register');
        }
    }

    static renderLogin(req, res) {
        res.render('users/login');
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const hashedPassword = bcrypt.hashSync(password, salt);
            const user = await User.findOne({ username, password: hashedPassword });

            if (user) {
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
