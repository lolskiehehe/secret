require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));   

const userSchema = new mongoose.Schema ({
    email :String,
    password : String
});


userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields: ['password']});

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

    const newUser = new User ({
        email : req.body.email,
        password : req.body.password
    });

    newUser.save(err =>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
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
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    })

})



app.listen(3000, ()=> {console.log("Successfully started server on port 3000");})