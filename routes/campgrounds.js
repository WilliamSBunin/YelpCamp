const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");


//INDEX
router.get("/", function (req, res) {
    Campground.find({}).then(campgrounds => {
        res.render("campgrounds/index", {
            campgrounds: campgrounds
        });
    }).catch(error => {
        console.log(error.message);        
        req.flash("error", "An unknown error occurred attempting to find campgrounds.");
        res.redirect("/campgrounds");
    });

});

//CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    let author = {
        id: req.user._id,
        username: req.user.username
    }

    Campground.create({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: author
    }).then(campground => {        
        req.flash("success", "Campground successfully added.");
        res.redirect("/campgrounds");
    }).catch(error => {
        console.log(error.message);
        req.flash("error", "An unknown error occurred attempting to create campground.");
        res.redirect("/campgrounds");
    });
});

//NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


//SHOW
router.get("/:id", function (req, res) {
    console.log("show information for id - ", req.params.id);

    Campground.findById(req.params.id).populate("comments")
        .then(campground => {
            if (!campground){
                req.flash("error", "An unknown error occurred attempting to find campground.");
                return res.redirect("/campgrounds");                
            }
            
            res.render("campgrounds/show", {
                campground: campground
            });
        }).catch(error => {
            console.log(error.message);
            req.flash("error", "An unknown error occurred attempting to find campground.");
            res.redirect("/campgrounds");
        });
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id)
        .then(campground => {
            if (!campground){
                req.flash("error", "An unknown error occurred attempting to find campground.");
                return res.redirect("/campgrounds");                
            }

            res.render("campgrounds/edit", {
                campground: campground
            });
        }).catch(error => {
            console.log(error.message);
            req.flash("error", "An unknown error occurred attempting to find campground.");
            res.redirect("/campgrounds");
        });
});

//update
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
        .then(campground => {
            req.flash("success", "Campground successfully updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }).catch(error => {
            console.log(error.message);
            req.flash("error", "An unknown error occurred attempting to find and update campground.");
            res.redirect("/campgrounds");
        });
})

//destroy
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id)
        .then((removedCampground) => {
            console.log("=========");
            console.log("removedCampground");
            console.log(removedCampground);

            removedCampground.comments.forEach(function (commentID) {
                Comment.findByIdAndRemove(commentID)
                    .then(removedComment => {
                        console.log(removedComment);
                    }).catch(error => {
                        console.log(error.message);
                        req.flash("error", "An unknown error occurred attempting to find and remove comments.");
                        res.redirect("/campgrounds");
                    });
            });

            req.flash("success", "Campground was successfully removed.");
            res.redirect("/campgrounds");
        }).catch(error => {
            console.log(error.message);
            req.flash("error", "An unknown error occurred attempting to find and remove campground.");
            res.redirect("/campgrounds");
        })
});

module.exports = router;