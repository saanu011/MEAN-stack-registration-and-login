var express = require('express');
var bodyparser = require('body-parser');
var morgon = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');

var config = require('./config');

var route = require('./app/routes/api');

var app = express();

//connecting to the database
mongoose.connect(config.database, { useNewUrlParser: true } , (err)=>{
    if(err){
        console.log('Error occured in connecting : ' + err )
    }
    else{
        console.log('Connected to database');
    }
});

//using middlewares
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(morgon('dev'));
app.use(cors());


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public');
});

/*app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})*/

//using route
app.use('/api', route);

app.listen(config.port, (err)=>{
    if(err){
        console.log('An error occurred' + err);
    }
    else{
        console.log('Server is listening on port: ' + config.port);
    }
})