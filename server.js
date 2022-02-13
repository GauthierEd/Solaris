// Config de express
const express = require("express");
const app = express();

// Config de http
const http = require("http");
const server = http.createServer(app);

// Config de socket.io
const { Server } = require("socket.io");
const io = new Server(server);

// Config de request
const request = require('request');


// Liste de ville pour l'application
const city = ["London,uk", "Paris,fr", "Madrid,es", "Rome,it", "New York City,us","Los Angeles,us"];

// Spécifie les répertoires que l'app doit utiliser
app.use("/src", express.static('./src/'));
app.use("/styles", express.static('./styles/'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("a user connected");
    let index = 0;
    // Envoie du JSON au client directement à la connexion
    getWeatherInfo(socket, createOption(city[index]));
    index = (index + 1) % city.length;

    // Envoie du JSON toutes les 30 secondes
    sendWeatherWithTimeOut(socket, index);
});

server.listen(3000, () => {
    console.log("Le serveur est lancé sur le port 3000");
});


// Fonction qui renvoie sous la forme d'un JSON la réponse de l'API Weather
function getWeatherInfo(socket, option) {
    request(option, function (error, response, body) {
        if (error) {
            throw new Error(error);
        } else {
            weather = JSON.parse(body);
            socket.emit("weather", weather);
        }
    });
}

// Fonction qui renvoi les options pour l'API Weather en prenant en parametre la ville souhaité
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
