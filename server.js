// Configuring express
const express = require("express");
const app = express();

// Configuring http
const http = require("http");
const server = http.createServer(app);

// Configuring socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// Configuring request
const request = require('request');

// Configuring dotenv
require('dotenv').config()
const port = process.env.PORT;
const timer = process.env.TIMER;
const key = process.env.API_KEY;

// City list for the application
const city = ["London,uk", "Paris,fr", "Madrid,es", "Rome,it", "New York City,us","Los Angeles,us"];

// Specifies the directories that the app need to work
app.use("/src", express.static('./src/'));
app.use("/styles", express.static('./styles/'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("A client is connected to the server");
    let index = 0;
    // Sends JSON to the client directly on connection
    getWeatherInfo(socket, createOption(city[index]));
    index = (index + 1) % city.length;

    // Send JSON every 30 seconds
    setInterval(function(){
        getWeatherInfo(socket, createOption(city[index]));
        index = (index + 1) % city.length;
    }, timer, index);
});

server.listen(port, () => {
    console.log("The server is running on port "+ port);
});


// Function that get the weather information from the API
function getWeatherInfo(socket, option) {
    request(option, function (error, response, body) {
        if (error) {
            throw new Error(error);
        } else {
            // Check is API response is a valid JSON
            try {
                weather = JSON.parse(body);
                sendWeatherInfoToClient(socket, weather);
            } catch(e){
                console.error("Parsing error:", e);
            }
        }
    });
}


// Function that send weather information JSON to the client
function sendWeatherInfoToClient(socket, weather){
    socket.emit("weather", weather);
}



// Function that returns options for the OpenWeather API by setting the desired city in parameter
function createOption(city){
    return options = {
        method: 'GET',
        url: 'https://community-open-weather-map.p.rapidapi.com/weather',
        qs: {q: city, lang: 'fr', units: 'metric'},
        headers: {
            'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
            'x-rapidapi-key': key,
            useQueryString: true
        }
    };
}