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
    sendWeatherWithTimeOut(socket, index);
});

server.listen(3000, () => {
    console.log("The server is running on port 3000");
});


// Function that get the weather information from the API
function getWeatherInfo(socket, option) {
    request(option, function (error, response, body) {
        if (error) {
            throw new Error(error);
        } else {
            weather = JSON.parse(body);
            sendWeatherInfoToClient(socket, weather);
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
            'x-rapidapi-key': '4b4f95b09fmsh03d913b83287832p17f84cjsne750ead9d017',
            useQueryString: true
        }
    };
}

// Fonction qui toutes les 30 secondes envoie au client le JSON de getWeatherInfo()
function sendWeatherWithTimeOut(socket,index){
    setTimeout(function(){
        getWeatherInfo(socket, createOption(city[index]));
        index = (index + 1) % city.length;
        sendWeatherWithTimeOut(socket, index);
    }, 30000);
}
