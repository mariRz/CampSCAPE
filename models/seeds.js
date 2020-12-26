var mongoose = require("mongoose");
var Campground = require("./campground");
var Comment = require("./comment");

var campgrounds = [
    {
        name: "Munmorah State Conservation", 
        price: "10",
        image: "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-campground-background.jpg", 
        description: "munmorah-state-conservation-area Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?"    },
    {
        name: "Boyd National Park", 
        price: "13",
        image: "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/ben-boyd-national-park/bittangabee-campground/bittangabee-campground-01.jpg",
        description: "ben-boyd-national-park Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?"
    },
    {
        name: "Frazer Campground", 
        price: "11",
        image: "https://www.nationalparks.nsw.gov.au/-/media/npws/images/bundle-pages/frazer-campground.jpg",
        description: "frazer-campground Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum illo porro reiciendis blanditiis! Molestiae deserunt nulla, atque explicabo nostrum aperiam. Modi saepe placeat minima distinctio! Magnam ipsam qui hic totam?"
    }
];

function seedDB(){
    //remove all campgrounds and comments from DB
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed all campgrounds.");
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed all comments.");
        });
        // add campgrounds to DB
        campgrounds.forEach(function(seed){
            Campground.create(seed, function(err, createdCampground){
                if(err){
                    console.log(err);
                }
                createdCampground.save();
            });
        });
    });
};

module.exports = seedDB;

