const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


const request = require('request');



const options = {
    method: 'GET',
    url: 'https://community-open-weather-map.p.rapidapi.com/weather',
    qs: {q: 'London,uk', lang: 'fr', units: 'metric'},
    headers: {
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        'x-rapidapi-key': '4b4f95b09fmsh03d913b83287832p17f84cjsne750ead9d017',
        useQueryString: true
    }
};


app.use("/src", express.static('./src/'));
app.use("/styles", express.static('./styles/'));



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("a user connected");
    getWeatherInfo(socket);
});

server.listen(3000, () => {
    console.log("listening on : 3000");
});



function getWeatherInfo(socket) {
    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error);
        } else {
            weather = JSON.parse(body);
            socket.emit("weather", weather);
        }
    });
}




