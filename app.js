const express = require('express');
const app = express();
const path = require('path');
const exprhb = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

process.env.PWD = process.cwd();
mongoose.Promise = global.Promise;

mongoose.connect(mongoDbUrl).then((db) => {
    console.log('Connected');
    
}).catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));

//Set view engine

const {select, generateDate, getCategory} = require('./helpers/handlebars-helpers');

app.engine('handlebars', exprhb({defaultLayout: 'home', helpers: {select: select, generateDate: generateDate, getCategory: getCategory}}));
app.set('view engine','handlebars');


// Upload Middleware

app.use(upload());


// Body parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Method override

app.use(methodOverride('_method'));


app.use(session({
    secret: 'alexvoloshin2000',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: true}

}));

app.use(flash());

// PASPORT

app.use(passport.initialize());
app.use(passport.session());

//Local variables using Middleware

app.use((req,res,next) => {

    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    next();
});

//Load routes

const main = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');

//Use routes



app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/', main);





app.listen(4500, () => {
    console.log(`Listening on port 4500..........`);
});








