const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
});

//sign in
router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    let newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password)
        .then(user => {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to yelp camp " + user.username + ".");
                res.redirect("/campgrounds");
            })
        }).catch(error => {
            // console.log(error);
            req.flash("error", error.message);
            res.redirect("/register");
        });
});

//Login
router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "User successfully logged in.",
    failureFlash: true
}), function (req, res) {});

//logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "User successfully logged out.");
    res.redirect("/campgrounds");
});

router.get("/.", function (req, res) {
    res.redirect("/");
});

module.exports = router;