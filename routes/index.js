"use strict";

var path = process.cwd();
var Poll = require("../models/polls");

module.exports = function(app, passport) {
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.sendFile(path + "/public/homeNLI.html");
        }
    }
    
    app.route("/")
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + "/public/homeLI.html");
        });
        
    app.route("/auth/twitter")
        .get(passport.authenticate("twitter"));
        
    app.route("/auth/twitter/callback")
        .get(passport.authenticate("twitter", {
            successRedirect: "/",
            failureRedirect: "/"
        }));
        
    app.route("/twitter-logout")
        .get(function (req, res) {
            req.logout();
            res.redirect("/");
        });
        
    app.route("/api/:id")
        .get(isLoggedIn, function(req, res) {
            res.json(req.user.twitter);
        });
        
    app.route("/controllers/userInfo.js")
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + "/controllers/userInfo.js");
        });
        
    app.route("/controllers/popup.js")
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + "/controllers/popup.js");
        });
        
    app.post("/save-poll", function (req, res) {
            var newPoll = new Poll();
            
            var optionsReady = {};
            for (var i = 0; i < req.body.opt.length; i++ ) {
                optionsReady[req.body.opt[i]] = 0;
            }
            
            newPoll.poll.author = req.user.twitter.username;
            newPoll.poll.title = req.body.title;
            newPoll.poll.options = optionsReady;
            
            newPoll.save(function (err) {
                if (err) throw err;
            });
            
            res.redirect("/mypolls");
        });
        
    app.route("/mypolls")
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + "/public/mypolls.html");
        });
        
    app.route("/api/:id/polls")
        .get(function(req, res) {
            Poll.find({}, function (err, docs) {
                if(err) throw err;
                var rts = [];
                docs.forEach(function(data){
                    var gpr = {
                        "id": data.id,
                        "title": data.poll.title,
                        "options": data.poll.options,
                        "author": data.poll.author
                    };
                    rts.push(gpr);
                });
                res.json(rts);
            });
        });
        
    app.route("/api/:id/mypolls")
        .get(function(req, res) {
            Poll.find({ "poll.author": req.user.twitter.username }, function (err, docs) {
                if(err) throw err;
                var rts = [];
                docs.forEach(function(data){
                    var gpr = {
                        "id": data.id,
                        "title": data.poll.title,
                        "options": data.poll.options,
                        "author": data.poll.author
                    };
                    rts.push(gpr);
                });
                res.json(rts);
            });
        });
        
    app.route("/poll=:pollID")
        .get(function(req, res) {
            Poll.findById(req.params.pollID, function(err, doc) {
                if (err) {
                    console.log(err);
                    res.send("Error: Poll not found");
                }
                if (doc) {
                    if (req.isAuthenticated()){
                        if (req.user.twitter.username === doc.poll.author){
                            res.sendFile(path + "/public/singlePollLIMP.html");
                        } else {
                            res.sendFile(path + "/public/singlePollLI.html");
                        }
                    } else {
                        res.sendFile(path + "/public/singlePollNLI.html");
                    }
                    
                }
            });
            
        });
        
    app.route("/api/:id/poll=:pollID")
        .get(function(req, res) {
            var ip = req.headers["x-forwarded-for"];
            var msg;
            if (req.isAuthenticated()) {
                msg = req.user.twitter.username;
            } else {
                msg = ip;
            }
            Poll.findById(req.params.pollID, function(err, doc) {
                if (err) throw err;
                var va = false;
                var voted = doc.poll.voted;
                for (var i = 0; i < voted.length; i++) {
                    if (voted[i] == msg) {
                        va = true;
                        break;
                    }
                }
                var rtssp = {
                    "id": doc.id,
                    "title": doc.poll.title,
                    "options": doc.poll.options,
                    "author": doc.poll.author,
                    "voted": va
                };
                res.json(rtssp);
            });
        });
        
    app.route("/delete/poll=:pollID")
        .get(function(req, res) {
            Poll.findById(req.params.pollID, function(err, doc) {
                if (err) {
                    console.log(err);
                    res.send("Error: Poll not found");
                }
                if (doc) {
                    if (req.isAuthenticated()){
                        if (req.user.twitter.username === doc.poll.author){
                            Poll.findByIdAndRemove(req.params.pollID, function(err){
                                if (err) throw err;
                            });
                            res.redirect("/mypolls");
                        } else {
                            res.redirect("/");
                        }
                    } else {
                        res.redirect("/");
                    }
                    
                }
            });
        });
    
    app.route("/addvote/poll=:pollID/option=:chopt")
        .get(function(req, res) {
            var upopt = req.params.chopt;
            var ip = req.headers["x-forwarded-for"];
            var msg;
            if (req.isAuthenticated()) {
                msg = req.user.twitter.username;
            } else {
                msg = ip;
            }
            
            var inc = { $inc: {} };
            inc.$inc["poll.options." + upopt] = 1;
            var push = { $push: {} };
            push.$push["poll.voted"] = msg;
            
            Poll.findById(req.params.pollID, function(err, doc) {
                if (err) throw err;
                var va = false;
                var voted = doc.poll.voted;
                for (var i = 0; i < voted.length; i++) {
                    if (voted[i] == msg) {
                        va = true;
                        break;
                    }
                }
                if (va === true) {
                    res.redirect("/poll=" + req.params.pollID);
                } else {
                    Poll.findOneAndUpdate({ "_id": req.params.pollID }, inc)
                        .exec(function(err, result) {
                            if(err) throw err;
                        });
                    Poll.findOneAndUpdate({ "_id": req.params.pollID }, push, {safe: true, upsert: true})
                        .exec(function(err, result) {
                            if(err) throw err;
                        });
                    res.redirect("/poll=" + req.params.pollID);
                }
            });
        });
};