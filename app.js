const express = require('express');
const app = express();
const path = require('path');
const exprhb = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'public')));


//Set view engine

app.engine('handlebars', exprhb({defaultLayout: 'home'}));
app.set('view engine','handlebars');

//Load routes

const main = require('./routes/home/index');
const admin = require('./routes/admin/index');

//Use routes


app.use('/admin', admin);
app.use('/', main);





app.listen(4500, () => {
    console.log(`Listening on port 4500..........`);
});








