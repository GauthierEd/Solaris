const socket = io();

socket.on("weather", function(e){
    console.log(e);
})