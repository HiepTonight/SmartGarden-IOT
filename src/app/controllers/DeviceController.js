const sensor = require('../models/sensor');
const { mongooseToObject } = require('../../util/mongoose');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { redirect } = require('statuses');

class DeviceController {

    index(req, res, next){
        res.render('device/show')
    }
    
    //[GET] area/:slug
    show(req, res, next){

        sensor.findOne({ slug: req.params.slug })
            .then((sensor) =>{
                res.render('area/show', { sensor: mongooseToObject(sensor) })
            })
            .catch(next);
    }

    //[GET] area/create
    create(req, res, next){
        res.render('area/create');
        
    }

    store(req, res, next){
        
        const formData = req.body;
        const area = new sensor(formData);
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
        sensor.updateOne({ _id: req.params.id}, req.body)
            .then(() => res.redirect('/me/stored/areas'))
            .catch(next);
    }

    //[DELETE] /area/:id
    delete(req, res, next){
        sensor.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }
    
}

module.exports = new DeviceController();
