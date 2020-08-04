const mongoose = require("mongoose");

const Campground = require("./models/campgrounds");
const Comment = require("./models/comment");

let data = [{
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({

        }).then(() => {
            console.log("removed campgrounds");

            //Add seeded campgrounds
            // data.forEach(function (seed) {
            //     Campground.create(seed)
            //         .then(campground => {
            //             console.log("added a campground");
            //             Comment.create({
            //                 text: "This place is great, but I wish there was internet",
            //                 author: "Homer"
            //             }).then(comment => {
            //                 campground.comments.push(comment);
            //                 campground.save();
            //                 console.log("Created new comment");
            //             }).catch(error => {

            //                 console.log(error);
            //             });
            //         }).catch(error => {
            //             console.log(error);
            //         });
            // });
        })
        .catch(error => {
            console.log("Error");
        });
}

module.exports = seedDB;



// Campground.create({
//     name: "Salmon Creek",
//     image: "https://cdn.pixabay.com/photo/2020/01/16/16/25/camping-4771050_960_720.jpg",
//     description: "This place has no salmon. None. No fish are allowed to exist here."
// }).then(campground => {
//     console.log("added campground", campground);
// }).catch(error => {
//     console.log(error.message);
// });
// Campground.create({
//     name: "Granet Hill",
//     image: "https://cdn.pixabay.com/photo/2020/07/11/15/09/volkswagen-5394322_1280.jpg"
// }).then(campground => {
//     console.log("added campground", campground);
// }).catch(error => {
//     console.log(error.message);
// });