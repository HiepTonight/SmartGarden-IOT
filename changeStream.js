const { MongoClient} = require('mongodb');

async function main() {
    const url = "mongodb+srv://hieptram40:123@cluster0.02rer4y.mongodb.net/Mangcambien_dev?retryWrites=true&w=majority"

    const client = new MongoClient(url)
    try {
        await client.connect();

        await monitorListingsUsingEventEmitter(client, 50000);
        

    } 
    catch (error){
        console.log(error)

    }
    finally {
        //await client.close();
    }
}

main().catch(console.error)

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []){  
    const collection = client.db("Mangcambien_dev").collection("sensors");
    const changeStream = collection.watch(pipeline);

    const mqttTopics = {}; 

    changeStream.on('change', (data) =>{
        console.log("Bắt đầu change stream")
          console.log(data);
        if (data.operationType === 'insert') {
            const document = data.fullDocument;
            const topic = document.topic;
            const documentId = data.fullDocument._id;
            mqttTopics[documentId] = topic;
            // Đăng ký (subscribe) vào topic mới
            // client.subscribe(topic);
            console.log("Sub topic "+ topic)
          }
        else if (data.operationType === 'delete') {
            const deletedDocumentId = data.documentKey._id;
            const topic = mqttTopics[deletedDocumentId];
            console.log("Khong sub vao topic " + topic)
            delete topic[deletedDocumentId];
        }

        else if (data.operationType === 'update' || data.operationType === 'replace') {
            const documentId = data.documentKey._id;
            const topic = data.updateDescription.updatedFields.topic;
            const preTopic = mqttTopics[documentId]
            console.log("Khong sub vao topic " +preTopic)
            delete preTopic[documentId];
            console.log("Bat dau sub vao topic " + topic)
            mqttTopics[documentId] = topic;
            console.log("Hash map moi " + mqttTopics[documentId])

        }
        
        
    
        
    })

    //await closeChangeStream (timeInMs, changeStream);
}




function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Đóng change stream");
            resolve(changeStream.close());
        }, timeInMs)
    })
};

