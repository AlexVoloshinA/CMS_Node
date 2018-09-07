const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', async (req,res) => {

    let posts = await Post.find();

    let category = await Category.find({});

    // req.session.alex = 'Alex Voloshin';

    // if(req.session.alex){
    //     console.log(`We found it ${req.session.alex}`);
    // }
    res.render('home/index', {posts: posts, category: category});
});

router.get('/about', (req,res) => {
    res.render('home/about');
});

router.get('/login', (req,res) => {
    res.render('home/login');
});

router.post('/login', (req,res) => {
    res.send('Test it oout');
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

router.get('/post/:id', async (req,res) => {

    let post = await Post.findById(req.params.id);
    let category = await Category.find({});
    res.render('home/post', {post: post, category: category});
});


module.exports = router;