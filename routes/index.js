var express = require("express");
var router = express.Router();
var passport = require("passport");
var Campground = require("../models/campground");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

 //authorisation routes:
 //register form
 router.get("/register", function(req, res){
    res.render("register", {baseUrl: req.baseUrl});
 });

 //register user post
 router.post("/register", function(req, res){
    var newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        avatar: "https://i.ya-webdesign.com/images/default-avatar-png-18.png"
    });
    if(req.body.adminCode === "adminPasscode"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        //
        console.log(newUser);
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
 });

//login form
router.get("/login", function(req, res){
    res.render("login");
});

//login post
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login",
        failureFlash: "Invalid username or password. <a href='/register'>Sign Up</a>",
        successFlash: "Welcome back!"
    }), function(req, res){
});

//logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged out.");
    res.redirect("/campgrounds");
});

// show user
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            Campground.find({"author.id": req.params.id}, function(err, userCampgrounds){
                if(err){
                    console.log(err);
                } else{
                    res.render("users/show", {user: foundUser, campgrounds: userCampgrounds}); 
                }
            })
        }
    })
});

//edit user
router.get("/users/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.render("users/edit", {user: user});
        }
    })
});

//update user
router.put("/users/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            console.log(err);
            req.flash("error", "Failed to update profile. Please try again.");
            res.redirect("/users/" + req.params.id + "/edit");
        } else{
            console.log(updatedUser);
            req.flash("success", "Profile updated successfully.");
            res.redirect("/users/" + req.params.id);
        }
    });
});

module.exports = router;
