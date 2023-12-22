const newsRouter = require('./news');
const meRouter = require('./me');
const areaRouter = require('./area');
const deviceRouter = require('./device');
const siteRouter = require('./site');


function route(app){
    
    // app.get("/news",function(req,res){
    //     res.render("news")
    // });

    app.use('/news',newsRouter);
    app.use('/me',meRouter);
    app.use('/area',areaRouter);
    app.use('/device', deviceRouter)
    
    app.use('/', siteRouter);

}

module.exports = route;