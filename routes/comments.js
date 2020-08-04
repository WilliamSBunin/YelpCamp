const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Comment = require("../models/comment");
const Campground = require("../models/campgrounds");
const middleware = require("../middleware");

//New
router.get("/new", middleware.isLoggedIn, function (req, res) {
    console.log("show information for /new -", req.params.id);

    Campground.findById(req.params.id)
        .then(campground => {
            if (!campground) {
                req.flash("error", "An unknown error occurred attempting to find campground.");
                return res.redirect("/campgrounds");
            }

            console.log(campground)
            res.render("comments/new", {
                campground: campground
            });
        }).catch(error => {
            req.flash("error", "An unknown error occurred attempting to find comment.");
            console.log(error.message)
        });
});

//Create
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id)
        .then(campground => {
            if (!campground) {
                req.flash("error", "An unknown error occurred attempting to find campground.");
                return res.redirect("/campgrounds");
            }

            Comment.create(req.body.comment)
                .then(comment => {
                    if (!comment) {
                        req.flash("error", "An unknown error occurred attempting to create comment.");
                        return res.redirect("/campgrounds");
                    }

                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    //save comment
                    campground.comments.push(comment);
                    campground.save()

                    req.flash("success", "Comment was successfully created.");
                    res.redirect("/campgrounds/" + campground._id);
                }).catch(error => {
                    console.log(error.message);
                    req.flash("error", "An unknown error occurred attempting to create comment.");
                    res.redirect("/campgrounds");
                });
        }).catch(error => {
            console.log(error.message)
            req.flash("error", "An unknown error occurred attempting to find campground.");
            res.redirect("/campgrounds");
        });
});

//edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id)
        .then(campground => {
            if (!campground) {
                req.flash("error", "An unknown error occurred attempting to find campground.");
                return res.redirect("/back");
            }

            Comment.findById(req.params.comment_id)
                .then(comment => {
                    if (!comment) {
                        req.flash("error", "An unknown error occurred attempting to find comment.");
                        return res.redirect("/back");
                    }

                    res.render("comments/edit", {
                        campground_id: campground._id,
                        comment: comment
                    });
                })
                .catch(error => {
                    req.flash("error", "An unknown error occurred attempting to find comment.");
                    res.redirect("/back");
                });
        });
});

//update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
        .then(comment => {
            req.flash("success", "Comment was successfully updated.");
            res.redirect("/campgrounds/" + req.params.id);
        })
        .catch(error => {
            req.flash("error", "An unknown error occurred attempting to find and update comment.");
            res.redirect("/back");
        })
});

//destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id)
        .then(comment => {
            req.flash("success", "Comment was successfully deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        })
        .catch(error => {
            req.flash("error", "An unknown error occurred attempting to find and remove comment.");
            res.redirect("/back");
        })
});

module.exports = router;