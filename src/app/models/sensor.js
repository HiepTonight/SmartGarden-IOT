const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const sensor = new Schema({
    name: {type: String},
    description: {type: String},
    topic: {type: String },
    light: {type: Boolean, default: false },
    heatLamp: {type: Boolean, default: false },
    waterValve: {type: Boolean, default: false },
    auto: {type: Boolean, default: false },
    slug: {type: String, slug: 'name',unique: true},

    data: {
        temp: [
            {
                value: {
                    type: Number,
                    default: 0,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        humi: [
            {
                value: {
                    type: Number,
                    default: 0,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        soil: [
            {
                value: {
                    type: Number,
                    default: 0,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    }

    // createdAt: {type: Date, default: Date.now},
    // updatedAt: {type: Date, default: Date.now},
}, {
    timestamps: true,
});

module.exports = mongoose.model('sensors', sensor);