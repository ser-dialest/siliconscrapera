var mongoose = require("mongoose");

// Save Schema
var Schema = mongoose.Schema;

// Create Notes Schema
var NoteSchema = new Schema({
    // arrays so I can have more than one.
    title: String,
    body: String
});

// Make model from Schema
var Notes = mongoose.model("Notes", NoteSchema);

// Export Notes 
module.exports = Notes;
