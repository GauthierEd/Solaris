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
    changeInnerHTML("#temp-ressentie",ressenti);

    // Vitesse du vent en km/h
    let wind = json.wind.speed;
    changeInnerHTML("#wind-speed",wind);

    let weather = json.weather[0].main;
}

function changeInnerHTML(selector, content){
    document.querySelector(selector).innerHTML = content;
}