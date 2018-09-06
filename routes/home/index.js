const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', async (req,res) => {

    let posts = await Post.find();

    // req.session.alex = 'Alex Voloshin';

    // if(req.session.alex){
    //     console.log(`We found it ${req.session.alex}`);
    // }
    res.render('home/index', {posts: posts});
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

    res.render('home/post', {post: post});
});


module.exports = router;