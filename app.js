const bodyParser=require("body-parser");
const ejs=require("ejs");
const express=require("express");
const mongoose=require('mongoose');

const app=express(); //new app instance
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true})); //b-p to pass our requests

app.use(express.static("public")); //to store static files such as images,css code

mongoose.connect("mongodb://localhost:27017/dolistDB"); //Allows mongoose to connect to local mongoDB instance

///////////////////////////////////////////////USERSCHEMA
const userSchema={
    username: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    email:{
        type: String,
        unique: true,
        required: true,
    },

};

// const User=mongoose.model("User",userSchema);

// app.post("/register",function(req,res){
    
//     const newUser=new User{{
//         username: request.body.username,
//         // email:req.body.email,
//         // password:req.body.password
//     }}

// })




////////////////////////////////////////////////////////
const doEntriesSchema={
    title:String
};

const Entry=mongoose.model("Entry",doEntriesSchema);

app.route("/entries")
.get(function(req, res){
    Entry.find(function(err, foundEntry){
      if(!err){
      res.send(foundEntry);
      }else{
          res.send(err);
      }
    });
  })
  .post(function(req,res){
    console.log(req.body.title);

    const newEntry=new Entry({
        title:req.body.title
    });

    newEntry.save(function(err){
        if(!err){
            res.send("Successfully added an entry.")
        }else{
            res.send(err);
        }
    });
})
.put(function(req,res){
    Entry.updateOne(
        {title:req.body.title,},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Updated entry");
            }
        }        
    )

})

.delete(function(req,res){
    Entry.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all entries");
        }else{
            res.send(err);
        }
    });
});



app.listen(3000,function(){
    console.log("Server started on Port 3000");

});
