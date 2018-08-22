// REQUIRED
require("dotenv").config();

var keys = require("./keys.js")
var Spotify = require("node-spotify-api");
// var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");
var fs = require("fs");

//commands!
var whatToRun = process.argv[2];
var userInput = process.argv.slice(3).join(" ");

    switch(whatToRun){
        case "concert-this":
        concertThis();
        break;
      case "spotify-this-song":
        spotifyThisSong();
        break;
      case "movie-this":
        movieThis();
        break;
      case "do-what-it-says":
        listenToTheMan();
        break;
      default:
        console.log("🚨🙅🏽‍♀️🆘 CHECK URSELF 🆘‍🙅🏽‍♀️🚨");
        break;
    
    }

/////////////////// START BANDSINTOWN
function concertThis(){
    var key = keys.bandsintown.key;
    if (!userInput){
        userInput = "paramore";
    }
    var URL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=" + key;
    
    request(URL, function(err, response, body){
        if(err){
            return console.log(err);
        }
        else if (!err && response.statusCode === 200) {
            var concertData = JSON.parse(body);
            var concertArray = [
                "Venue: " + concertData[0].venue.name,
                "Location: " + concertData[0].venue.city,
                "Date: " + moment(concertData[0].datetime).format("MM/DD/YYYY")     
            ].join("\n\n");

            fs.appendFile("log.txt", concertArray, function(err) {
                if (err) throw err;
            });
        console.log(concertArray);
        };
    });

};
/////////////////// END BANDSINTOWN


/////////////////// START SPOTIFY
function spotifyThisSong(){
    var spotify = new Spotify(keys.spotify);
    if(!userInput){
        userInput = "Wake Up Jacob";
    }

    spotify.search({
        type: "track",
        query: userInput
    }, function(err, data) {
        if (err) {
          return console.log("Error occurred: " + err);
        } else{
            var spotifyData = data;
            var songData = spotifyData.tracks.items[0];
            var spotifyArray = [
                "Artist(s): " + songData.artists[0].name,
                "Song: " + songData.name,
                "Sneak Peek 😉: " + songData.preview_url,
                "Album: " + songData.album.name
            ].join("\n\n");
            fs.appendFile("log.txt", spotifyArray, function(err) {
                if (err) throw err;
            });
            console.log(spotifyArray);
        };
       
      });
      
};
/////////////////// END SPOTIFY

/////////////////// START OMDB
function movieThis(){
    var key = keys.omdb.apikey;
    if (!userInput){
        userInput = "Open Your Eyes";
    }
    var URL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=" + key;
    request(URL, function(err, response, body){
        if(err){
            return console.log(err);
        }
        else if (!err && response.statusCode === 200){
            var omdbData = JSON.parse(body);
            var omdbArray = [
                "Title: " + omdbData.Title,
                "Year: " + moment(omdbData.Released).format("MM/DD/YYYY"),
                "IMDB Rating: " + omdbData.imdbRating,
                "Rotten Tomatoes Rating: " + omdbData.Ratings[2].Value,
                "Country Produced In: " + omdbData.Country,
                "Language: " + omdbData.Language,
                "Plot: " + omdbData.Plot,
                "Actors: " + omdbData.Actors
            ].join("\n\n");

            fs.appendFile("log.txt", omdbArray, function(err) {
                if (err) throw err;
            });
            console.log(omdbArray);

        };
    });
};
/////////////////// END OMDB

/////////////////// START do-what-it-says
function listenToTheMan(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        }
        var newData = data.split(",")
        newData.forEach(function(element){
             element.trim();
        });
        fs.appendFile("log.txt","do-what-it-says\n", function(err){
            if(err){
                console.log(err);
            }
        });
        whatToRun = newData[0]
        userInput = newData[1]
    });

}
/////////////////// END do-what-it-says
