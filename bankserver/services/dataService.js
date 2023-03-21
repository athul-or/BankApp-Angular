const jwt = require('jsonwebtoken')


//import db.js

const db = require('./db')




//REGISTER

const register = (acno, username, password) => {
    return db.User.findOne({ acno }).then( //asynchronous call
        user => {
            if (user) {
                return {
                    status: false,
                    statusCode: 401,
                    msg: 'User already exists!'
                }
            }
            else {
                const newUser = new db.User({
                    acno: acno,
                    username: username,
                    password: password,
                    balance: 0,
                    transaction: []
                })
                newUser.save()//to save to  mdb
                return {
                    status: true,
                    statusCode: 200,
                    msg: 'Register Successful'
                }
            }
        }
    )
}

//LOGIN


const login = (acno, password) => {
    return db.User.findOne({ acno, password }).then(
        user => {
            if (user) {
                currentUser = user.username;
                currentAcno = acno;
                balance = user.balance;
                const token = jwt.sign({ currentAcno: acno }, 'secretkey777')
                return {
                    status: true,
                    statusCode: 200,
                    msg: 'Login Successful',
                    token: token,
                    currentUser:user.username,
                    currentAcno:acno,
                    balance:user.balance
                }
            } else {
                return {
                    status: false,
                    statusCode: 401,
                    msg: 'Invalid user details'
                }
            }
        }
    )

}


//DEPOSIT

const deposit = (acno, password, amt) => {
    var amount = parseInt(amt);
    return db.User.findOne({ acno, password }).then(
        user => {
            if (user) {
                if (password == user.password) {
                    user.balance += amount;
                    user.transaction.push({
                        type: 'Credit',
                        amount
                    })
                    user.save()
                    return {
                        status: true,
                        statusCode: 200,
                        balance:user.balance,
                        msg: `${amount} is credited to your account.${user.balance}`
                    }
                }
                else {
                    return {
                        status: false,
                        statusCode: 401,
                        msg: 'Invalid user details'
                    }
                }
            }
        }
    )
}


//WITHDRAW

const withdraw = (acno, password, amt) => {
    var amount = parseInt(amt);

    return db.User.findOne({ acno, password }).then(
        user => {
             if (user) {
                if (password == user.password) {
                    if (user.balance > amount) {
                        user.balance -= amount;
                        user.transaction.push({
                            type: 'Debit',
                            amount
                        })
                        user.save()
                        return {
                            status: true,
                            statusCode: 200,
                            balance:user.balance,
                            msg: `${amount} is debited from your account.${user.balance}`
                        }
                       }
                    else{
                        return{
                        status:false,
                        statusCode:401,
                        msg:'Insufficient balance'
                        }
                    }}
                   else {
                     return {
                        status: false,
                        statusCode: 401,
                        msg: 'Invalid user details'
                    }
                }
            }
                else{
                    return{
                        status: false,
                        statusCode: 401,
                        msg: 'Invalid user details'
                    }
                }

            }
    )
}

//TRANSACTION

const getTransaction = (acno) => {
    return db.User.findOne({acno}).then(
        user=>{
        if(user){
            return{
                status: true,
                statusCode: 200,
                transaction: user.transaction
            }
        }
        else{
            return{
                status: false,
                statusCode: 401,
                msg: 'User not found'
            }  
        }
      }
)
}

//DELETE

const deleteAcc = (acno)=>{
   return db.User.findOneAndDelete({acno}).then(
        user=>{
            if(user){
                return{
                    status: true,
                    statusCode: 200,
                    msg:"Account Deleted Successfully"
                }
            }
            else{
                return{
                    status: false,
                    statusCode: 401,
                    msg: 'Something went wrong!'
                } 
            }
        }
    )
}

//PROFILE

const profile = (acno) =>{
    return db.User.findOne({acno}).then(
        user=>{
            if(user){
                return{
                    status: true,
                    statusCode: 200,
                    username:user.username,
                    password:user.password,
                    balance:user.balance
                }
            }
            else{
                return{
                    status: false,
                    statusCode: 401,
                    msg: 'Something went wrong!'
                } 
            }
        }
    )
}

module.exports = { register, login, deposit, withdraw, getTransaction, deleteAcc, profile };