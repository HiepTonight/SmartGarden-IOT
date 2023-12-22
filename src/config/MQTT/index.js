var mqtt = require("mqtt");
var mongoose = require('mongoose');
const sensor = require('../../app/models/sensor');
const dataSensor = require('../../app/models/dataSensor')
const { mutipleMongooseToObject } = require('../../util/mongoose');
const mqttTopics = {};
const sensorId = {};
const CollectionName = {};


//Config
var io;

const mqttUrl = 'tls://897e4e4bd28b411ba2464a4019281121.s1.eu.hivemq.cloud:8883';

var options = {
  protocol: 'mqtts',
  username: 'my_mqtt',
  password: 'hellomqtt',
};

var client = mqtt.connect(mqttUrl, options);
client.on('connect',function(){
console.log("MQTT đã kết nối")
})

async function mqttConnect(server) {
    
    try {
        

        //Startup server
        const sensorData = await sensor.find({})
        // console.log(sensorData)
        sensorData.forEach(data => {

          const topicName = data.topic;
          const documentId = data._id;

          sensorId[topicName] = documentId.toString();

          mqttTopics[documentId] = topicName;

          client.subscribe(topicName, (err) => {
            if (!err) {
              console.log(`Đăng ký Subcribe MQTT topic: ${topicName}`);
            } else {
              console.error(`Đăng ký Subcribe thất bại đến MQTT topic: ${topicName}`);
            }
          });
        })

        await socketConfig(server);

        await monitorListingsUsingEventEmitter(mongoose.connection, 50000);        
      
        // console.log(mqttTopics);
        
        // await monitorListingsUsingEventEmitter(DBclient, 50000);

        handleData(client);

        //socketHandle();

         
    } 
    
    catch (error) {
      console.log(error);
    }

    finally {
      // DBclient.close();
    }

}


function handleData(client) {
  client.on('message',function(topic,message){
    const tenkhuvuc = CollectionName[topic];
    
    var x = String(topic);
    var temp = x+"temp";
    var humi = x+"humi";
    var soil = x+"soil";

    // const Collection = mongoose.model(tenkhuvuc,dataSensor);
    
    console.log("Có dữ liệu mới: " + message + " từ topic: " + topic);
    let data = JSON.parse(message);
    
    var temp_data = data.temp;
    var humi_data = data.humi;
    var soil_data = data.soil;

    // const newData = new Collection({temp: temp_data, humi: humi_data, soil: soil_data});
    // newData.save()
    //   .then(() => {
    //     console.log("New document added to the new collection!");
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    const id = sensorId[topic]
    console.log(id)
    sensor.findByIdAndUpdate(id, {
      $push: {
          'data.temp': { value: data.temp, timestamp: new Date() },
          'data.humi': { value: data.humi, timestamp: new Date() },
          'data.soil': { value: data.soil, timestamp: new Date() },
      },
  }, { new: true } )
      .then(() => console.log('luu thanh cong'))
      .catch((err) => console.log(err))


    io.emit(temp,temp_data)
    io.emit(humi,humi_data)
    io.emit(soil,soil_data)
  })
}



function socketConfig(server) {
    io = require("socket.io")(server);

    io.on("connection",function(socket){
      console.log("Thiết bị: " + socket.id+ " vừa truy cập");
  
      socket.on("disconnect",function(){
          console.log("Thiết bị " + socket.id + " đã ngắt kết nối");
      });
    });

    Object.values(mqttTopics).forEach(topic => {
      const x = String(topic)
      const light = "light-"+x;
      const heatLamp = "heatLamp-"+x;
      const waterValve = "waterValve-"+x;
      // console.log(light)
      io.on("connection",function(socket){
        socket.on(light, function(state){
          
          if(state=="0"){
            client.publish(light,"0")
            console.log("Pub data vao topic "+light+" data: "+ state)
           
          }else{
            client.publish(light,"1")
            console.log("Pub data vao topic "+light+" data: "+ state)
        }
        })
      });
      io.on("connection",function(socket){
        socket.on(heatLamp, function(state){
          
          if(state=="0"){
            client.publish(heatLamp,"0")
            console.log("Pub data vao topic "+heatLamp+" data: "+ state)
           
          }else{
            client.publish(heatLamp,"1")  
            console.log("Pub data vao topic "+heatLamp+" data: "+ state)
        }
        })
      });
      io.on("connection",function(socket){
        socket.on(waterValve, function(state){
          
          if(state=="0"){
            client.publish(waterValve,"0")
            console.log("Pub data vao topic "+waterValve+" data: "+ state)
           
          }else{
            client.publish(waterValve,"1")
            console.log("Pub data vao topic "+waterValve+" data: "+ state)
        }
        })
      });
    })

    return io
}

async function monitorListingsUsingEventEmitter(connection, timeInMs = 60000, pipeline = []){  
  const collection = connection.collection("sensors");
  const changeStream = collection.watch(pipeline);

  console.log("Bắt đầu change stream")
  // const mqttTopics = {}; 

  changeStream.on('change', (data) =>{
      //console.log("Có data mới từ Main database")
      //console.log(data);
      if (data.operationType === 'insert') {
          const document = data.fullDocument;

          const topic = document.topic;
          const documentId = data.fullDocument._id;

          mqttTopics[documentId] = topic;

          sensorId[topic] = documentId.toString();

          const modelDocument = new sensor(document)
          // sensorMap[topic] = modelDocument;
        
          // Đăng ký (subscribe) vào topic mới
          client.subscribe(topic);
          console.log("Đăng ký Subcribe MQTT topic: " + topic)
        }
      else if (data.operationType === 'delete') {
          const deletedDocumentId = data.documentKey._id;
          const topic = mqttTopics[deletedDocumentId];
          const tenkhuvuc = CollectionName[topic];

          // mongoose.connection.dropCollection(tenkhuvuc)
          //   .then(() => console.log('Da xoa collection ' + tenkhuvuc))
          //   .catch((err) => {
          //     console.error(err);
          //   })
          
          client.unsubscribe(topic);
          console.log("Dừng đăng ký Subcribe MQTT topic: " + topic)
          delete mqttTopics[deletedDocumentId];
          delete sensorId[topic]

      }

      else if (data.operationType === 'update' || data.operationType === 'replace') {
          // console.log(data)
          const documentId = data.documentKey._id;
          const topic = data.updateDescription.updatedFields.topic;
          const preTopic = mqttTopics[documentId]

          if(typeof topic === 'undefined'){
            //Khong lam gi ca
          }
          else if(topic !== preTopic){
            client.unsubscribe(preTopic);
            console.log("Dừng đăng ký Subcribe MQTT topic: " +preTopic)
            delete mqttTopics[documentId];
            delete sensorId[preTopic]

            client.subscribe(topic);
            console.log("Đăng ký Subcribe MQTT topic: " + topic)
            mqttTopics[documentId] = topic;
            sensorId[topic] = documentId.toString()
            console.log("Hash map moi " + mqttTopics[documentId])
          }
          
          const auto = data.updateDescription.updatedFields.auto;
          if (auto === "on"){}
      }
      
  })

  //await closeChangeStream (timeInMs, changeStream);
}

async function docDataCheck(data){
  if(!sensorMap[data]){
    await sensor.find({ topic: data })
      .then((foundDocument) => {
        sensorMap[data] = foundDocument;
        console.log('luu sensor map moi ')
        console.log(sensorMap[data])
      })
      .catch((err) => {
        console.error('Lỗi khi tìm kiếm document:', err);
      });
  }
}

function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
      setTimeout(() => {
          console.log("Đóng change stream");
          resolve(changeStream.close());
      }, timeInMs)
  })
};

function newIolisten(){

}

module.exports = { mqttConnect };