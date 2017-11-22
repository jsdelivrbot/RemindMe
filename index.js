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
    let jsonData = require('./todos.json');    
    res.send(jsonData);
});
// Static Routes
app.use(express.static('public'));

// Socket Setup
var io = socket(server);

io.on('connection',function(socket){
    //Handling an action of button click on the phone
    socket.on('change-notify', function(data){
        // Get content from file
        let jsonData = require('./todos.json');

        console.log("test "+jsonData.length+":"+JSON.stringify(jsonData));
        if(jsonData==""){
            jsonData = "["+data+"]";
        }else{
            jsonData.push(JSON.parse(data));
        }
        fs.writeFile("todos.json", jsonData, function (err) {
            if (err) return console.log(err);
        });
        socket.broadcast.emit('list-changed',JSON.stringify(jsonData));
    });
});