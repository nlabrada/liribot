// REQUIRED
var keys = require("./keys.js")

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var request = require("request");

var moment = require("moment");

var dotenv = require("dotenv");

var fs = require("fs");
