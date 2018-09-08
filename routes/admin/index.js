const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const faker = require('faker');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', async (req,res) => {

    const promises = [
        Post.count().exec(),
        Category.count().exec(),
        Comment.count().exec()
    ];

    Promise.all(promises).then(([postCount, categoryCount, commentCount]) => {
        res.render('admin/index', {postCount: postCount, categoryCount: categoryCount, commentCount: commentCount });
    });

    // let postCount = await Post.count();


    
});


router.post('/generate-fake-posts', async (req,res) => {

   
    for(let i = 0; i < req.body.amount; i++){
      let post = new Post();

      post.title = faker.name.title();
      post.status = 'Public';
      post.allowComments = faker.random.boolean();
      post.slug = faker.name.title();
      post.body = faker.lorem.sentences();

      await post.save();
    };

    res.redirect('/admin/posts');


});


module.exports = router;