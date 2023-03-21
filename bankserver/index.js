//Server Creation


//Import Express

const express = require('express');

//import jwt

const jwt = require('jsonwebtoken')

//import cors

const cors = require('cors')



const dataService = require('./services/dataService');

// Create  an application using express

const app = express();

app.use(express.json())


app.use(cors({
    origin:'http://localhost:4200'
}))
//Create  a port number

app.listen(3000, () => {
    console.log("Connected");
})

//Application specific middleware

const appMiddleware = (req, res, next) => {
    console.log('Application specific middleware')
    next();
}

//Router specific middleware

const jwtRouterMiddleware = (req, res, next) => {
    try{
        console.log('Router specific middleware');
        const token = req.headers['x-access-token']
        const data = jwt.verify(token, 'secretkey777')
        console.log(data);
        next();
    }
    catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            msg:'Please login to continue'}

        )
    }
}

app.use(appMiddleware)


//REGISTER

app.post('/register', (req, res) => {
      dataService.register(req.body.acno, req.body.username, req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result);
        }
      )
      
})

//LOGIN

app.post('/login', (req, res) => {
    dataService.login(req.body.acno, req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result);
        }
    )
})

//DEPOSIT

app.post('/deposit', jwtRouterMiddleware, (req, res) => {
    dataService.deposit(req.body.acno, req.body.password, req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result);
        }
    )
    
})

//WITHDRAW

app.post('/withdraw', jwtRouterMiddleware, (req, res) => {
    dataService.withdraw(req.body.acno, req.body.password, req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result);
        }
    )
})

//TRANSACTION

app.post('/transaction', jwtRouterMiddleware, (req, res) => {
     dataService.getTransaction(req.body.acno).then(
        result=>{
            res.status(result.statusCode).json(result);
        }
     )
})


//DELETE

app.delete('/delete/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(
        result=>{
            res.status(result.statusCode).json(result);
        }   
    )
})

//PROFILE

app.post('/profile',(req,res)=>{
    dataService.profile(req.body.acno).then(
        result=>{
            res.status(result.statusCode).json(result);
        }   
    )
})