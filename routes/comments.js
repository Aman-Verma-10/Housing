var express = require('express'),
    router  = express.Router() ,
    Campground = require('../models/campground'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware');

//comments new
router.get("/houses/:id/comments/new", middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground : campground});
        }
    })
    
});

//comments create
router.post("/houses/:id/comments",middleware.isLoggedIn,function(req,res){
    // lookup campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/houses");
        } else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id ;
                    comment.author.username = req.user.username ;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/houses/' + campground._id);
                }
            })
        }
    });
});

// COMMENT EDIT
router.get("/houses/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
             res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE
router.put("/houses/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/houses/" + req.params.id);
        }
    })
})

// COMMENT DESTROY ROUTE
router.delete("/houses/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/houses/" + req.params.id);
        }
    })
})






module.exports = router;
