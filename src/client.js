const socket = io();

socket.on("weather", (args) => {
    console.log(args);
});