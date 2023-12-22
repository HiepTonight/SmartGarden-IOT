const sensor = require('../models/sensor');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    
    //[GET] area/:slug
    storedAreas(req, res, next){
        sensor.find({})
            .then(sensors => res.render('me/stored-areas',{
                sensors: mutipleMongooseToObject(sensors)
            }))
            .catch(next)
        
    }
}

module.exports = new MeController();
