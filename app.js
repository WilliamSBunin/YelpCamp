const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require("method-override");

//user created
const Campground = require("./models/campgrounds");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");

//routs
const commentRoutes = require("./routes/comments");
const campgroundsRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/index");

// mongoose.connect('mongodb://localhost:27017/yelp_camp', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log('Connected to DB yelp_camp!')
//     })
//     .catch((error) => {
//         console.log(error.message)
//     });

mongoose.connect('mongodb+srv://wbunin:yelpyelp11416@cluster0.q2ei7.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Connected to DB yelp_camp!')
    })
    .catch((error) => {
        console.log(error.message);
    });
    

mongoose.set('useFindAndModify', false);

//flash messages. must be before passport configuration
app.use(flash());

//Passport configuration
app.use(require("express-session")({
    secret: "Camp Camp Camp. The Camp is a Camp.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Universal middleware - set universal variables
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
})

//using ejs files
app.set("view engine", "ejs");

//Using body parser - used to get data from forms
app.use(bodyParser.urlencoded({
    extended: true
}));

//Set public directory - visible to end user
app.use(express.static(__dirname + "/public"));
//method override - used for non post/get events (put, delete)
app.use(methodOverride("_method"));

//Set routs
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/", authRoutes);

app.listen(3000, function () {
    console.log("listening on port 3000");
});