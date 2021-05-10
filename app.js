require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));   

const userSchema = new mongoose.Schema ({
    email :String,
    password : String
});



const User = mongoose.model("User", userSchema);


app.get("/", (req, res)=>{

    res.render("home");

})


app.get("/login", (req, res)=>{

    res.render("login");
    
})


app.get("/register", (req, res)=>{

    res.render("register");
    
})

app.post("/register", (req, res)=>{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const newUser = new User ({
            email : req.body.email,
            password : hash
        });
    
        newUser.save(err =>{
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });

    
})

app.post("/login", (req, res)=>{

    const email = req.body.email;
    const password = req.body.password

    User.findOne({email: email}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secrets");
                    }
                });
            }
        }
    })

})



app.listen(3000, ()=> {console.log("Successfully started server on port 3000");})