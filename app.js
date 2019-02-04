const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const flash = require('connect-flash');
const session = require('express-session');

//Passport config
require('./config/passport')(passport);

//Database
const db = require('./config/database').mongoURI;

//Connect to database
mongoose.connect(db, { useNewUrlParser : true })
    .then(() => console.log('Successful connection'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('views', [
    path.join(__dirname, 'views'), 
    path.join(__dirname, 'views/auth'), 
    path.join(__dirname, 'views/layouts')
]);
app.use(express.static(path.resolve('./public')));
app.set('view engine', 'ejs');

//bodyParser
app.use(express.urlencoded({ extended : false }));

//Express session
app.use(
    session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));

app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3333;

app.listen(PORT, console.log(`Server started on port ${PORT}`))