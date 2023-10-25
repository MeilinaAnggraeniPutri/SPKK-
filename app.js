const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session');
const app = express()
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



//connecting to mongoose
const url = 'mongodb://127.0.0.1:27017/SPKK';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', () => {
    console.log('CONNECTION OPEN!!!');
});
db.on('error', err => {
    console.log('OH NO ERROR!!!');
    console.log(err);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));


const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//routes
const jabatanRoute = require('./routes/jabatanRoute')
const penilaianRoute = require('./routes/penilaianRoute')
const pegawaiRoute = require('./routes/pegawaiRoute')
const categoryRoute = require('./routes/categoryRoute')
const dashboardRoute = require('./routes/dashboardRoute')
const userRoute = require('./routes/user')
// const penilaianRoute = require('./routes/penilaianRoute')
// const userRoute = require('./routes/userRoute')

app.use('/', dashboardRoute, userRoute)
app.use('/jabatan', jabatanRoute)
app.use('/penilaian', penilaianRoute)
app.use('/pegawai', pegawaiRoute)
app.use('/category', categoryRoute)




//error route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

//listen to port 3000
app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000')
})
