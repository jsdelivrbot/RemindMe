var express = require('express');
var socket = require('socket.io');
var fs = require("fs");

// App setup
var app  = express();
var server = app.listen((process.env.PORT || 5000),function(){
    console.log("Server UP ON PORT: "+ (process.env.PORT || 5000));

});

//Get all active connections
app.get('/test', function (req, res) {
        // Get content from file
    var contents = fs.readFileSync("todos.json");
    // Define to JSON type
    var jsonContent = JSON.parse(contents);
    res.send(jsonContent);
});
// Static Routes
app.use(express.static('public'));

// Socket Setup
var io = socket(server);

io.on('connection',function(socket){
    //Handling an action of button click on the phone
    socket.on('change-notify', function(data){
        socket.broadcast.emit('list-changed',data);
    });
});