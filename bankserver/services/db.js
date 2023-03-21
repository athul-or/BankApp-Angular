//server - mongoDB connecting

//import mongoose

const mongoose = require('mongoose');

//state connection string via mongoose

mongoose.connect('mongodb://localhost:27017/BankServer',{
    useNewUrlParser:true //to avoid unwanted warnings
})


//Define model

const User = mongoose.model('User',{//model creation
    //schema
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={User};