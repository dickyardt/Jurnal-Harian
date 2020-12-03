const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Selamat datang di jurnal harian, di sini Anda dapat menuliskan catatan, kegiatan, maupun cerita Anda. Silakan klik compose untuk membuat jurnal yang baru.";
const aboutContent = "Jurnal harian adalah salah satu aplikasi web yang saya buat dengan menggunakan EJS, dan expressJS.";
const contactContent = "github.com/dickyardt";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-dicky:Test123@cluster0.6izca.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post",postSchema);

app.get("/", function(req,res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });

});

app.get("/about", function(req,res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.post("/compose", function(req,res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

 Post.findOne({_id: requestedPostId}, function(err,post){
   res.render("post",{
     title: post.title,
     content: post.content
   });
 });
});

let port = process.env.PORT;
if (port == null || port ==""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});

