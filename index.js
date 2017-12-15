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
    MongoClient.connect(url, function(err, dbm) {
        var db = dbm.db("remindme");
        db.collection("todos").find({}).toArray(function(err, result) {
            if (err) throw err;
            socket.emit('list-changed',JSON.stringify(result));
        });
        dbm.close();
    }); 
    //Handling an action of button click on the phone
    socket.on('change-notify', function(data){
        data = data.replace("/", "");
        //console.log("pbj"+ JSON.stringify(data))

        MongoClient.connect(url, function(err, dbm) {
            if (err) throw err;
            var db = dbm.db("remindme");
            var myobj = JSON.parse(data);
            db.collection("todos").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted = "+ JSON.stringify(myobj));
            });
            db.collection("todos").find({}).toArray(function(err, result) {
                if (err) throw err;
                socket.broadcast.emit('list-changed',JSON.stringify(result));
            });
            dbm.close();
        });
    });

    socket.on('done-notify', function(data){
        //console.log("pbj"+ JSON.stringify(data))

        MongoClient.connect(url, function(err, dbm) {
            if (err) throw err;
            var db = dbm.db("remindme");
            var myquery = { _id: data };
            var newvalues = { done: true };
            db.collection("todos").updateOne(myquery, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
            });
            db.collection("todos").find({}).toArray(function(err, result) {
                if (err) throw err;
                socket.broadcast.emit('list-changed',JSON.stringify(result));
            })
            dbm.close();
        });
    });

});