var express       = require("express"),
    appEx         = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./models/seeds")
    
//require routes
var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);
appEx.use(bodyParser.urlencoded({extended: true}));
appEx.set("view engine", "ejs");
appEx.use(express.static(__dirname + "/public"));
appEx.use(methodOverride("_method"));
appEx.use(flash());
seedDB();
appEx.locals.moment = require("moment");

//configuration of passport session
appEx.use(require("express-session")({
    secret: "secret message",
    resave: false, 
    saveUninitialized: false 
}));

appEx.use(passport.initialize());
appEx.use(passport.session());
///...
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables
appEx.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

appEx.use(indexRoutes);
appEx.use("/campgrounds", campgroundRoutes);
appEx.use("/campgrounds/:id/comments", commentRoutes);

appEx.listen(process.env.PORT || 3000, function(){
    console.log("Server has started.");
});