const express = require("express");
var mongoose = require('mongoose');


const job = require("../models/job");
const hrProfile = require("../models/hr-profile");
const canProfile = require("../models/cand-profile");


const app = express.Router();

//hr post job
app.post("/create_job", function (req, res, next) {
    // console.log("get job posted data: ", req.body);
    job.create(req.body, function (err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

//hr check posted jobs
app.post("/posted_job", function (req, res, next) {
    job.find({ hr_id: req.body.hr_id}, function (err, post) {
        if (err) return next(err);
        return res.json(post);
    }).sort({"candidate.rank" : 1});
});

//candidate check applied jobs
app.post("/posted_job/apply-history", function (req, res, next) {
    job.find(
        { 
            hr_id: req.body.hr_id,
            candidate: { $elemMatch: { candidate_id : req.body.candidate_id } }
         }
        , function (err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

//delete a posted job
app.post("/delete_job", function (req, res, next) {
    job.deleteOne({ job_id: req.body.job_id }, function (err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

//update a posted job
app.post("/update_job", function (req, res, next) {
    console.log(req.body.expirationDate);
    job.updateOne(
        { job_id: req.body.job_id },
        {   
            hr_id : req.body.hr_id,
            company: req.body.company,
            title: req.body.title,
            startDate: req.body.startDate,
            expirationDate: req.body.expirationDate,
            jobDescription: req.body.jobDescription,
            industryType: req.body.industryType,
            jobType: req.body.jobType,
            location: req.body.location,
            // candidate: req.body.candidate
        }, 
        function (err, result) {
            if (err) {
                res.status(401).json({ message: "Not authorized!" });
            } else {
                res.status(200).json({ message: "Update successful!" });
            }
        });
});

//hr delete or update posted jobs
//add it later as needed


//hr get list of candidate , return candidate array back to the front end
app.post("/candidate_list", function (req, res, next) {
    job.find({job_id: req.body.job_id}, function (err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

//hr get specific candidates profile
app.post("/check_candidate", function (req, res, next) {
    canProfile.findOne({ can_id: req.body.can_id }, function (err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

//get defalut info
app.post("/get-profile", (req, res, next) => {
    // console.log(" server get id # is:", req.body);
    hrProfile.findOne({ hr_num: req.body.hr_num })
        .then(account => {
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ message: "Account not found!" });
            }
    });
});

// sharmi test
//get employers details
app.post("/employers-contact", (req, res, next) => {
    // console.log(" server get id # is:", req.body);
    hrProfile.find({  },function (err, post) {
        if (err) return next(err);
        return res.json(post);
    });
});

//hr update profile
app.put("/update", function (req, res, next) {
    // console.log("update hr profile: ", req.body);
    hrProfile.updateOne(
        { hr_num: req.body.hr_id },
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            title: req.body.title,
            company: req.body.company,
            startDate: req.body.startDate,
            note: req.body.note,
            contacts: req.body.contacts,
        },
        function (err, result) {
            if (err) {
                res.status(401).json({ message: "Not authorized!" });
            } else {
                res.status(200).json({ message: "Update successful!" });
            }
        });
});


module.exports = app;