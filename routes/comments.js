var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
       if(err){
           console.log(err);
       }
       // new comment page
       res.render("comments/new", {campground: campground});
       
   })
})

//create comment
router.post("/", middleware.isLoggedIn, function(req, res){
   //find campground by id
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       }
       // create comment in db
       Comment.create(req.body.comment, function(err, createdComment){
           if(err){
               console.log(err);
           }
           //add username and id to comment
           createdComment.author.id = req.user._id;
           createdComment.author.username = req.user.username;
           //save comment
           createdComment.save();
           //push comment to campground
           campground.comments.push(createdComment);
           campground.save();
           console.log("created comment");
            //req.flash("success", "Successfully added comment.");
            res.redirect("/campgrounds/" + campground._id);
       });
   });
});

// edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        //find comment by id
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                console.log(err);
            }
            //display edit form
            res.render("comments/edit", {campground:campground, comment:comment});
        });
    });
    
});

// update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, {new:true}, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else{
            res.redirect("/campgrounds/" + req.params.id );
        }
        
    });
});

//delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            req.flash("error", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id );
        }
        
    });
});

module.exports = router;
