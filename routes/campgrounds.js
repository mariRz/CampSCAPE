var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

// campgrounds index
router.get("/", function(req, res){
    var noMatchMsg;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                if(allCampgrounds.length < 1){
                    noMatchMsg = "No results found. Please try a different query."
                }
                res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatchMsg: noMatchMsg});
            }
        });
    } else {
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatchMsg: noMatchMsg});
            }
        });
    }
});

// new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// create campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {id: req.user._id, username: req.user.username}
    var newCampground = {name: name, price: price, image: image, author: author, description: description};
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("new campground");
            console.log(campground);
            req.flash("success", "New campground added.");
            res.redirect("/campgrounds");
        }
    });
});

// show campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, fCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: fCampground});
        }
    });
});

// edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground}); 
        }
    });
});

// update campground PUT
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,{new: true}, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE campground
router.delete("/:id", middleware.checkCampgroundOwnership,  function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

