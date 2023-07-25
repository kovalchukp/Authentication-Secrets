require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const encrypt = require ("mongoose-encryption");
const app = express();

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://127.0.0.1/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(
        res.render("secrets")
    ).catch(err => {
        console.log(err);
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then(function(foundUser){
        if(foundUser){
             if (foundUser.password === password) {
                 res.render("secrets");
            }
        }
    }).catch(err => {
        console.log(err);
    });
});


 app.listen(process.env.PORT || 3000, function () {
        console.log("Server started on port 3000");
    });