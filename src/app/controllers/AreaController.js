const sensor = require('../models/sensor');
const dataSensor = require('../models/dataSensor');
var mongoose = require('mongoose');
const db = mongoose.connection;
const { mongooseToObject } = require('../../util/mongoose');
const { redirect } = require('statuses');

class AreaController {
    
    //[GET] area/:slug
    show(req, res, next){

        sensor.findOne({ slug: req.params.slug })
            .then((sensor) =>{
                const sensorData = sensor.data
                
                res.render('area/show', { sensor: mongooseToObject(sensor) })
                // res.json(data)
                // res.json(sensorData)
            })
            .catch(next);
    }

    //[GET] //area/data/:slug
    data(req, res, next){
        sensor.findOne({ slug: req.params.slug })
            .then((sensor) =>{
                const sensorData = sensor.data
                //console.log(sensorData)
                res.json(sensorData)
            })
            .catch(next);
    }

    //[GET] area/create
    create(req, res, next){
        res.render('area/create');
        
    }

    store(req, res, next){
        
        const formData = req.body;
        //console.log(formData)
        // const formDevice = new device({ light: 'off', heatingLamp: 'off', valve: 'off' });
        // formDevice.save()
        //     .then(() => console.log("Data thiet bi moi da duoc tao"))
        //     .catch(error => {})
        const area = new sensor(formData);
        // db.createCollection(formData.name.toLowerCase())
        area.save()
            .then(() => res.redirect('/'))
            .catch(error => {})
       
        
    }

    edit(req, res, next){
        sensor.findById(req.params.id)
        .then(sensor => res.render('area/edit',{
            sensor: mongooseToObject(sensor)
        }))
    }

    //[PUT] area/:id
    update(req, res, next){
        console.log(req.params.id)
        console.log(req.body)
        sensor.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/me/stored/areas'))
            .catch(next);
    }

    //[DELETE] /area/:id
    delete(req, res, next){
        sensor.deleteOne({ _id: req.params.id})
            .then(() => {
                res.redirect('back')
            })
            .catch(next);
    }

    //[PUT] /control/id
    control(req,res, next){
        // const a=sensor.findOne({ _id: req.params.id })
        const field = req.body.field
        const value = req.body.value
        const isCheked = value ==='true'
        var update = {};
        update[field] = isCheked;
        sensor.updateOne({ _id: req.params.id}, { $set: update })
            .then(() => res.redirect('back') )
            .catch(next);
        console.log(req.params.id)
        // console.log(a)
        console.log(req.body)
        console.log(update)
    }
    
}

module.exports = new AreaController();
