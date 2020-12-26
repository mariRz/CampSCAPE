var express    = require("express");
var app        = express();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", err.message);
                res.redirect("/campgrounds");                                             
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You do not have correct permissions.");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "Please <a href='/login'>Login</a> or <a href='/register'>Sign up</a>.");
        res.redirect("/campgrounds");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        // find comment by id
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found.");
                res.redirect("/campgrounds");
            } else {
                // if comment owner is logged in
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You do not have correct permissions.");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "Please <a href='/login'>Login</a> or <a href='/register'>Sign up</a>.");
        res.redirect("/campgrounds");
    }
};


middlewareObj.checkUserAccountOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        console.log(req.user.id);
        // find user by id
        if(currentUser.id.equals(req.user._id)){
            next();
        } else {
            req.flash("error", "You do not have correct permissions.");
            res.redirect("/campgrounds");
        }
    } else {
        req.flash("error", "Please <a href='/login'>Login</a> or <a href='/register'>Sign up</a>.");
        res.redirect("/campgrounds");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please <a href='/login'>Login</a> or <a href='/register'>Sign up</a>.");
    res.redirect("/login");
}

// middlewareObj.storePreviousUrl = function(req, res, next){
//     urls.push(req.objectUrl);
//     return 
// }

module.exports = middlewareObj;