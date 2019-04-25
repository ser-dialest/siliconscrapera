// Necssary NPM packages
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Inckude models
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

// Routes

// Ro