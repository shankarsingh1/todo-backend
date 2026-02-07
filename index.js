const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {UserModel , TodoModel} = require("./db");
const secret = "jokhayburger"


mongoose.connect("mongodb+srv://shankarsingh01248_db_user:qXghNSWw9mIDFJlZ@cluster0.sb9rzc7.mongodb.net/");
const app = express();

app.use(express.json());

app.post("/signup",async function(req,res){

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email : email,
        password : password,
        name : name
    })

    res.json({
        msg : "account create"
    })

})
app.post("/signin", async function(req,res){

   const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password : password
    })

    if(user){
        const token = jwt.sign({id:user._id.toString()},secret);
        res.json({
            token : token
        })
    } else {
        res.status(401).json({
         msg :"invalid credentials"
        })
    }

})

function auth(req, res , next){

    const token = req.headers.token;
    const info = jwt.verify(token, secret);

    if(info){
        req.userId = info.id

           next();
    } else{
        res.status(401).json({
            msg : "invalid token"
        })
    }
}

app.post("/addTodo",auth ,async function(req,res){

const title = req.body.title;
const done = req.body.done;
const userId = req.userId;

await TodoModel.create({
    title:title,
    done:done,
    userId:userId

})

res.json({
    msg: "todo added"
})

})

app.get("/todos",auth ,async function(req,res){

const userId = req.userId;

const todos = await TodoModel.find({
    userId: userId
})

res.json({
    todos
})
})





app.listen(3000);