const express = require("express");
const methodOverride = require('method-override')
const path = require('path');
const app = express();
const handlebars = require('express-handlebars');
const port = 3000;

const route  = require('./routes');
const db =  require('./config/db');
const mqtt = require('./config/MQTT')

//Ket noi MQTT
// mqtt.mqttConnect();
// mqtt.test();

//Ket noi voi DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'config/Socket.io')));


app.use(express.urlencoded());

app.use(methodOverride('_method'))

//Template engine
app.engine('handlebars', handlebars.engine({
    helpers:{
        sum: (a,b) => a+b,
        // eq: function(a, b, options) { return (a == b) ? options.fn(this) : options.inverse(this); }
    }
}));
app.set("view engine","handlebars");
app.set('views', path.join(__dirname, 'resources','views'));
// app.set('views',"./src/resources/views");

//Route init/ khoi tao tuyen duong
route(app);



var server = require("http").Server(app);
// var io = require("socket.io")(server);
mqtt.mqttConnect(server);
server.listen(port);

//testcase {"temp":15,"humi":50,"soil":55}