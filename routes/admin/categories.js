const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const mongoose = require('mongoose');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', async (req,res) => {
    let categories = await Category.find({});
    debugger;
    res.render('admin/categories/index', {categories: categories});
});
router.get('/index', async (req,res) => {
    let categories = await Category.find({});
    debugger;
    res.render('admin/categories/index', {categories: categories});
});

router.post('/create', async (req,res) => {

    let newCategory = new Category({
        name: req.body.name
    });

    let savedCategory = await newCategory.save();

    res.redirect('index');
});

router.get('/edit/:id',async (req,res) => {

    let category = await Category.findById(req.params.id);
    res.render('admin/categories/edit', {category: category});
});

router.put('/edit/:id', async (req,res) => {
    let category = await Category.findById(req.params.id);

    category.name = req.body.name;
    
    await category.save();
    res.redirect('/admin/categories/index');
});

router.delete('/delete/:id', async (req,res) => {
    let category = await Category.findById(req.params.id);
    await category.remove();
    res.redirect('/admin/categories/index');
});


module.exports = router;