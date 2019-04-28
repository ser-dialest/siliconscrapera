// Necssary NPM packages
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Include models
var db = require("./models");

// Define port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/siliconscrapera";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/", function(req, res) {
    db.Articles.find({})
        .populate("notes")
        .then(function(dbArticles) {
            // console.log(dbArticles[0].notes);
            // convert to object 
            var hbsObject = {
                articles: dbArticles
            }   
            res.render("index", hbsObject);
        })
        .catch(function(err) {
            //Catch error
            res.json(err);
        });    
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.siliconera.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $(".post").each(function(i, element) {
            var title = $(element).children("h2").children("a").text();
            var blurb = $(element).children(".postdescription").children("p").text();
            var link = $(element).children("h2").children("a").attr("href");
            var small = $(element).children("small").text();
            var author = small.substring(3, small.indexOf('.')).trim();
            var date = small.substring(small.indexOf('.')+2);
            date = date.substring(0, date.indexOf('.')).trim();
            // Save these results in an object that we'll push into the results array we defined earlier
            var results = {
                title: title,
                link: link,
                author: author,
                blurb: blurb,
                date: date,
                note: []
            };
            db.Articles.create(results)
                .then(function(dbArticles) {
                    console.log("scraped!");
                    // console.log(dbArticles);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });
});

app.post("/articles/:id", function(req, res) {
    db.Notes.create(req.body)
        .then(function(note) {
            return db.Articles.findOneAndUpdate({_id: req.params.id}, { $push: { notes: note._id } }, { new: true });
        })
        .then(function(dbArticles) {
            console.log("refresh!!!");
            res.json(dbArticles);
            
        })
        .catch(function(err) {
            //Catch error
            res.json(err);
        });
});

// db.Articles.update({_id: req.params.id.toString()}, { $push: { notes: note._id.toString() } });
// db.Articles.update({_id: "5cc5429cebeaf80d5463d1ad"}, { $push: { notes: "5cc560c1d4152a4da0eae3b6" } })
    


// Listen on port 3000
app.listen(PORT, function() {
console.log("App running on port 3000!");
});