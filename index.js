var express = require('express');
var socket = require('socket.io');
var fs = require("fs");

// App setup
var app  = express();
var server = app.listen((process.env.PORT || 5000),function(){
    console.log("Server UP ON PORT: "+ (process.env.PORT || 5000));

});

//Get all active connections
app.get('/todos', function (req, res) {
    // Get content from file
    var contents = fs.readFileSync("todos.json");
    // Define to JSON type
    //var jsonContent = JSON.parse(contents);
    res.send(contents);
});
// Static Routes
app.use(express.static('public'));

// Socket Setup
var io = socket(server);

io.on('connection',function(socket){
    //Handling an action of button click on the phone
    socket.on('change-notify', function(data){
        // Get content from file
        var contents = fs.readFileSync("todos.json");
        // Define to JSON type
        var jsonContent = JSON.parse(contents);
        jsonContent.push(data);
        fs.writeFile("todos.json", jsonContent, function (err) {
            if (err) return console.log(err);
        });
        socket.broadcast.emit('list-changed',jsonContent);
    });
});