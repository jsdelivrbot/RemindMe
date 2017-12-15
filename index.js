var express = require('express');
var socket = require('socket.io');
var fs = require("fs");
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://noam:noam@ds059207.mlab.com:59207/remindme";

// App setup
var app  = express();
var server = app.listen((process.env.PORT || 5000),function(){
    console.log("Server UP ON PORT: "+ (process.env.PORT || 5000));
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database connected!");
        db.close();
    });
});

//Get all active connections
app.get('/todos', function (req, res) {


});
// Static Routes
app.use(express.static('public'));

// Socket Setup
var io = socket(server);

io.on('connection',function(socket){
    //Handling an action of button click on the phone
    socket.on('change-notify', function(data){
        data = data.replace("/", "");
        console.log("pbj"+ JSON.stringify(data))
        // Get content from file
        //let jsonData = require('./todos.json');
       /* 
        jsonData.todos.push(JSON.parse(data));
        fs.writeFile("todos.json", jsonData, function (err) {
            if (err) return console.log(err);
        });
        */
        MongoClient.connect(url, function(err, dbm) {
            if (err) throw err;
            var db = dbm.db("remindme");
            var myobj = { todo: "Company Inc", done: false };
            db.collection("todos").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              
              db.close();
            });
          });
        
    });
});