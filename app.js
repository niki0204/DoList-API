const bodyParser=require("body-parser");
const ejs=require("ejs");
const express=require("express");
const mongoose=require('mongoose');

const app=express(); 
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true})); 

mongoose.connect("mongodb://localhost:27017/dolistDB"); 


const userSchema={
    username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    email:{
        type: String,
        required: true,
    },
    title:String,
    entrystatus:String


};

const User=mongoose.model("User",userSchema);

app.route("/users")
.get(function(req,res){
    User.find(function(err,foundUser){
        if(!err){
            res.send(foundUser);
            
        }else{
            res.send(err);
        }
    });
})
.post(function(req,res){

    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        title:req.body.title,
        entrystatus:req.body.entrystatus

    });
    newUser.save(function(err){
        if(!err){
            res.send("Successfully added a user entry.")
        }else{
            res.send(err);
        }
    });
})


.delete(function(req,res){
    User.deleteMany(
        function(err){
        if(!err){
            res.send("Successfully deleted entry");
        }else{
            res.send(err);
        }
    });
});

app.route("/users/:title")
.get(function(req,res){
    User.findOne({title:req.params.title},function(err,foundEntry){
        if(foundEntry){
            res.send(foundEntry);
        }else{
        res.send("No title matching");
        }
    });
})


.patch(function(req, res){

    User.updateOne(
      {title: req.params.title},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("updated entry.");
        } else {
          res.send(err);
        }
      }
    );
  })
  
  .delete(function(req, res){
  
    User.deleteOne(
      {title: req.params.title},
      function(err){
        if (!err){
          res.send("Successfully deleted entry.");
        } else {
          res.send(err);
        }
      }
    );
  });
  
  


app.listen(3000,function(){
    console.log("Server started on Port 3000");

});
