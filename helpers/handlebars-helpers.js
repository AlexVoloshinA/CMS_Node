const moment = require('moment');
const mongoose = require('mongoose');
const Category = require('../models/Category');

module.exports = {


    select: function(selected, options) {

        return options.fn(this).replace(new RegExp('value=\"' + selected + '\"'), '$&selected="selected"');

    },


    generateDate: function(date, format){
        return moment(date).format(format);
    },

    // getCategory:   function(id){
    //     return Category.findById(id).then(res => {
    //         if(res != null){
    //             //console.log(res);
    //             res.then(res =>{ return res.name});
    //         }
    //     }).catch(err => {

    //     });  //.then(res => { if(res != null) console.log(res); });
    //     // debugger;
    //     // if(cat == null){
    //     //     return "---";
    //     // }
        
        
    //     // console.log(cat);
    //     // return cat.then((result) => {
    //     //     return result.name;
    //     // }).catch((err) => {
            
    //     // });
    //     // debugger;
    //     // return cat.name;
    // }






















};