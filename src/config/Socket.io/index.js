// const socket = io();
// const sensor = require('../../app/models/sensor');

// socket.on('1', function(data_received){
//     let giatri = data_received
//     console.log(data_received)
//     document.getElementById("1").innerHTML = giatri + " haha";
// })


// socketListen()
// sensor.find({})
//         .then(sensor =>{
//            console.log(sensor)
//         })
//         .catch(err)

// function handleSocketTopics(sockets){
//     sockets.forEach(socket => {
//         const topicName = socket.topic;
//         socket.on(topicName,function(data_received){
//             let test = data_received;
//             document.getElementById(topic).innerHTML = test + "°C";
//         })
//     });
// }