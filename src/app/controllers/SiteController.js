const sensor = require('../models/sensor');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    //[GET] /
    index(req, res, next){

        // sensor.find({}, function(err, sensor){
        //     if(!err) {
        //         res.json(sensor);
        //     } else {
        //     next(err);
        //     }
        // })

        sensor.find({})
            .then(sensor => {
                res.render('home', { 
                    sensor : mutipleMongooseToObject(sensor)
                });
            })
            .catch(next);
        
        // res.json({
        //     name: 'test'
        // });

        // res.render('home');
    }

    //[GET] /:slug
    search(req, res){
        res.render('search')
    }
}

module.exports = new SiteController();
