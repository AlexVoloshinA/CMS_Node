const express = require('express');
const app = express();
const path = require('path');
const exprhb = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/cms').then((db) => {
    console.log('Connected');
    
}).catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));


//Set view engine

const {select} = require('./helpers/handlebars-helpers');

app.engine('handlebars', exprhb({defaultLayout: 'home', helpers: {select: select}}));
app.set('view engine','handlebars');

// Body parser

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Method override

app.use(methodOverride('_method'));

//Load routes

const main = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');

//Use routes


app.use('/admin', admin);
app.use('/admin/posts', posts);
app.use('/', main);





app.listen(4500, () => {
    console.log(`Listening on port 4500..........`);
});








