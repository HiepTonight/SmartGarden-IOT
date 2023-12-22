
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const dataSensor = new Schema({
    temp: {type: Number},
    humi: {type: Number},
    soil: {type: Number},

    // createdAt: {type: Date, default: Date.now},
    // updatedAt: {type: Date, default: Date.now},
}, {
    timestamps: true,
});

module.exports = dataSensor;