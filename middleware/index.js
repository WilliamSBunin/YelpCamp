const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");

let middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("logged in")
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObject.checkCampgroundOwnership = function (req, res, next) {
    //Is user logged in?
    if (!req.isAuthenticated()) {
        req.flash("error", "User must be logged in to use that feature.");
        res.redirect("back");
    }

    Campground.findById(req.params.id)
        .then(campground => {
            if (!campground) {
                req.flash("error", "An unknown error occurred attempting to find campground.");
                return res.redirect("/back");
            }
            
            //Is user logged in as campground author?
            if (campground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Only the author of that post can use that feature.");
                res.redirect("back");
            }
        }).catch(error => {
            req.flash("error", error.message);
            res.redirect("back");
        });
}


middlewareObject.checkCommentOwnership = function (req, res, next) {
    //Is user logged in?
    if (!req.isAuthenticated()) {
        console.log("");
        req.flash("error", "User must be logged in to use that feature.");
        res.redirect("back");
    }

    //is comment owned by user
    Comment.findById(req.params.comment_id)
        .then(comment => {
            if (!comment) {
                req.flash("error", "An unknown error occurred attempting to find comment.");
                return res.redirect("/back");
            }

            if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "Only the author of that comment can use that feature.");
                res.redirect("back");
            }
        }).catch(error => {
            req.flash("error", error.message);
            res.redirect("back");
        });
}

module.exports = middlewareObject;