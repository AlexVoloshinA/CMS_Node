const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', async (req,res) => {

    const perPage = 10;
    const page = req.query.page || 1;

    let posts = await Post.find()
        .skip((perPage*page) - perPage)
        .limit(perPage);

    let category = await Category.find({});

    let postCount = await  Post.count();

    // req.session.alex = 'Alex Voloshin';

    // if(req.session.alex){
    //     console.log(`We found it ${req.session.alex}`);
    // }
    res.render('home/index', {posts: posts, category: category, current: parseInt(page), pages: Math.ceil(postCount / perPage)});
});

router.get('/about', (req,res) => {
    res.render('home/about');
});

router.get('/login', (req,res) => {
    res.render('home/login');
});

// APP Login

passport.use(new LocalStrategy({ usernameField: 'email'}
,(email, password, done) =>{

    User.findOne({email: email}).then(user => {
        if(!user) return done(null, false, {message: 'No user found'});

        bcrypt.compare(password, user.password, (err, matched) => {
            if(err) return err;

            if(matched){
                return done(null, user);
            } else {
                return done(null, false, {message: 'No user found'});
            }
        });

    });

    
}));

passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id,done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login', (req,res, next) => {

    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true 

    })(req,res,next);
});

router.get('/logout', (req,res) => {

    req.logOut();
    res.redirect('/login');
});


router.get('/register', (req,res) => {
    res.render('home/register');
});

router.post('/register', async (req,res) => {

    let errors = [];

    if(!req.body.firstName) {
        errors.push({message: 'please enter your first name'});
    }

    if(!req.body.lastName) {
        errors.push({message: 'please enter your last name'});
    }

    if(!req.body.password) {
        errors.push({message: 'please enter your password'});
    }

    if(!req.body.passwordConfirm) {
        errors.push({message: 'the field cannot be blank'});
    }

    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: 'Password fields don`t match'});
    }

    if(errors.length > 0){
        res.render('home/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        });
    
    } else {

        let user = await User.findOne({email:req.body.email});

        if(!user){
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            });


            bcrypt.genSalt(10,  (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {

                    newUser.password = hash;

                    await newUser.save();

                
                })
            })

            res.redirect('/login');

        } else {
            res.redirect('/login');
        }
    }

});

router.get('/post/:slug', async (req,res) => {

    let post = await Post.findOne({slug: req.params.slug})
    
    .populate('user')
    .populate({path: 'comments', match: {approveComment: true}, populate: {path: 'user', model: 'users'}});
    let category = await Category.find({});
    

    
    
    res.render('home/post', {post: post, category: category});
});


module.exports = router;