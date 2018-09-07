const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');

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

router.get('/register', (req,res) => {
    res.render('home/register');
});

router.get('/post/:id', async (req,res) => {

    let post = await Post.findById(req.params.id);
    let category = await Category.find({});
    res.render('home/post', {post: post, category: category});
});


module.exports = router;