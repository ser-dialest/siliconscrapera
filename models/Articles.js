var mongoose = require("mongoose");

// Save Schema
var Schema = mongoose.Schema;

// Articles Schema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
      type: String,
      required: true
  },
  date: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  blurb: {
      type: String,
      required: true
  },
  notes: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Notes" 
  }]
});

// Create mongoose model
var Articles = mongoose.model("Articles", ArticleSchema);

// Export Articles
module.exports = Articles;
