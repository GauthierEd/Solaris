const url = "https://openweathermap.org/img/wn/"

const socket = io();

socket.on("weather", (args) => {
    console.log(args);
    displayInfo(args);
});

function displayInfo(json){
    // Nom de la ville
    let cityName = json.name;
    changeInnerHTML("#city-name",cityName);

    // Coordonnées de la ville
    let longitude = json.coord.lon;
    changeInnerHTML("#lon",longitude);
    let latitude = json.coord.lat;
    changeInnerHTML("#lat",latitude);

    // Température de la ville en celcius
    let temperature = json.main.temp;
    changeInnerHTML("#temp",temperature);

    // Température ressentie de la ville en celcius
    let ressenti = json.main.feels_like;
    changeInnerHTML("#temp-ressentie-value",ressenti);

    // Vitesse du vent en km/h
    let wind = json.wind.speed;
    changeInnerHTML("#wind-speed-value",wind);

    // Description de la météo
    let weather = json.weather[0].description;
    changeInnerHTML("#weather-title",(weather[0].toUpperCase() + weather.substring(1)) );

    // Icon de la météo envoyé par l'API OpenWeather
    let weatherIcon = json.weather[0].icon;
    let weatherImg = document.querySelector("#weather-img");
    weatherImg.src = url + weatherIcon + ".png";
}

function changeInnerHTML(selector, content){
    document.querySelector(selector).innerHTML = content;
}